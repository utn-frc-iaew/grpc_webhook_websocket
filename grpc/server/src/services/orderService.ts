import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { logger } from '@realtime-labs/shared';
import { randomUUID } from 'crypto';
import path from 'path';

import { OrderModel } from '../models/Order';

const PROTO_PATH = path.resolve(__dirname, '../../proto/order.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

type ProtoGrpcType = {
  orders: {
    OrderService: grpc.ServiceClientConstructor & {
      service: grpc.ServiceDefinition;
    };
  };
};

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

interface OrderMessage {
  id: string;
  customerEmail: string;
  amount: number;
  status: string;
  notes?: string;
  createdAt: string;
}

interface OrderChatMessage {
  author: string;
  text: string;
  orderId: string;
  sentAt: string;
}

interface CreateOrderRequest {
  order?: OrderMessage;
}

interface CreateOrderResponse {
  order?: OrderMessage;
}

interface GetOrdersRequest {
  status?: string;
}

const toMessage = (doc: typeof OrderModel.prototype & { orderId: string }): OrderMessage => ({
  id: doc.orderId,
  customerEmail: doc.customerEmail,
  amount: doc.amount,
  status: doc.status,
  notes: doc.notes ?? '',
  createdAt: doc.createdAt.toISOString(),
});

export const registerOrderService = (server: grpc.Server) => {
  const serviceDefinition = protoDescriptor.orders.OrderService.service;

  const handlers: grpc.UntypedServiceImplementation & {
    CreateOrder: grpc.handleUnaryCall<CreateOrderRequest, CreateOrderResponse>;
    GetOrders: grpc.handleServerStreamingCall<GetOrdersRequest, OrderMessage>;
    ChatOrders: grpc.handleBidiStreamingCall<OrderChatMessage, OrderChatMessage>;
  } = {
    CreateOrder: async (
      call: grpc.ServerUnaryCall<CreateOrderRequest, CreateOrderResponse>,
      callback: grpc.sendUnaryData<CreateOrderResponse>,
    ) => {
      try {
        const payload = call.request.order;
        if (!payload) {
          callback({ code: grpc.status.INVALID_ARGUMENT, message: 'Order payload required' });
          return;
        }

        const orderId = payload.id || randomUUID();

        const doc = await OrderModel.create({
          orderId,
          customerEmail: payload.customerEmail,
          amount: payload.amount,
          status: (payload.status as 'created' | 'fulfilled' | 'canceled') || 'created',
          notes: payload.notes,
        });

        logger.info({ orderId, customerEmail: doc.customerEmail, amount: doc.amount }, 'CreateOrder succeeded');
        callback(null, { order: toMessage(doc) });
      } catch (error) {
        logger.error({ err: error }, 'CreateOrder failed');
        callback({ code: grpc.status.INTERNAL, message: 'Failed to create order' });
      }
    },
    GetOrders: async (call: grpc.ServerWritableStream<GetOrdersRequest, OrderMessage>) => {
      try {
        const status = call.request.status as 'created' | 'fulfilled' | 'canceled' | undefined;
        const orders = await OrderModel.find(status ? { status } : {}).lean();

        logger.info({ status: status ?? 'all', count: orders.length }, 'GetOrders streaming response');

        for (const order of orders) {
          call.write({
            id: order.orderId,
            customerEmail: order.customerEmail,
            amount: order.amount,
            status: order.status,
            notes: order.notes ?? '',
            createdAt: order.createdAt.toISOString(),
          });
        }
      } catch (error) {
        logger.error({ err: error }, 'GetOrders failed');
        call.destroy(error as Error);
      } finally {
        call.end();
      }
    },
    ChatOrders: (call: grpc.ServerDuplexStream<OrderChatMessage, OrderChatMessage>) => {
      call.on('data', (message: OrderChatMessage) => {
        logger.info({ message }, 'ChatOrders message received');
        call.write({
          author: 'server',
          text: `Ack: ${message.text}`,
          orderId: message.orderId,
          sentAt: new Date().toISOString(),
        });
      });

      call.on('end', () => {
        call.end();
      });
    },
  };

  server.addService(serviceDefinition, handlers);
};
