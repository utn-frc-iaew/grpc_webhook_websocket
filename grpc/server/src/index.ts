import * as grpc from '@grpc/grpc-js';
import { connectMongo, logger } from '@realtime-labs/shared';
import dotenv from 'dotenv';

dotenv.config();

import { registerOrderService } from './services/orderService';

const port = process.env.PORT || '50051';

const start = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      throw new Error('MONGO_URL is required');
    }

    await connectMongo(mongoUrl);

    const server = new grpc.Server();
    registerOrderService(server);

    server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err) => {
      if (err) {
        logger.error({ err }, 'Failed to bind gRPC server');
        return;
      }

      server.start();
      logger.info(`gRPC server started on port ${port}`);
    });

    const shutdown = () => {
      logger.info('Shutting down gRPC server');
      server.tryShutdown((error) => {
        if (error) {
          logger.error({ err: error }, 'Graceful shutdown failed');
          server.forceShutdown();
        }
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error({ err: error }, 'Failed to start gRPC server');
    process.exit(1);
  }
};

void start();
