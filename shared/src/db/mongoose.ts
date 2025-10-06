import mongoose from 'mongoose';

import { logger } from '../utils/logger';

let cachedConnection: typeof mongoose | null = null;

export const connectMongo = async (uri: string) => {
  if (cachedConnection) {
    return cachedConnection;
  }

  mongoose.set('strictQuery', false);

  try {
    await mongoose.connect(uri);
    cachedConnection = mongoose;
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error({ err: error }, 'MongoDB connection failed');
    throw error;
  }

  return mongoose;
};

export const disconnectMongo = async () => {
  if (cachedConnection) {
    await mongoose.disconnect();
    cachedConnection = null;
    logger.info('MongoDB disconnected');
  }
};
