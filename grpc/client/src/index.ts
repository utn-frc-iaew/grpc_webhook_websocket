import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config();

const PROTO_PATH = path.resolve(__dirname, '../proto/order.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const ordersPackage = grpc.loadPackageDefinition(packageDefinition) as unknown as {
  orders: {
    OrderService: grpc.ServiceClientConstructor;
  };
};

const envSchema = z.object({
  GRPC_SERVER_URL: z.string().min(3),
});

const { GRPC_SERVER_URL } = envSchema.parse(process.env);

const client = new ordersPackage.orders.OrderService(
  GRPC_SERVER_URL,
  grpc.credentials.createInsecure(),
);

let readiness: Promise<void> | null = null;

const ensureClientReady = (timeoutMs = 15000) => {
  if (!readiness) {
    readiness = new Promise<void>((resolve, reject) => {
      client.waitForReady(Date.now() + timeoutMs, (error) => {
        if (error) {
          readiness = null;
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

  return readiness;
};

export const createOrder = async () => {
  await ensureClientReady();

  return new Promise<Record<string, unknown> | undefined>((resolve, reject) => {
    client.CreateOrder(
      {
        order: {
          id: `order-${Date.now()}`,
          customerEmail: 'cli@example.com',
          amount: 120,
          status: 'created',
          notes: 'CLI demo order',
          createdAt: new Date().toISOString(),
        },
      },
      (error: grpc.ServiceError | null, response: { order?: Record<string, unknown> }) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(response.order);
      },
    );
  });
};

if (require.main === module) {
  createOrder()
    .then((order) => {
      console.log('Order created via CLI:', order);
      client.close();
    })
    .catch((error) => {
      console.error('Failed to create order', error);
      client.close();
      process.exitCode = 1;
    });
}
