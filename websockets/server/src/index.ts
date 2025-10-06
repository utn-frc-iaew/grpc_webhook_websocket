import { connectMongo, logger } from '@realtime-labs/shared';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { z } from 'zod';

import { registerChatChannel } from './channels/chat';
import { registerNotificationsChannel } from './channels/notifications';

dotenv.config();

const port = Number(process.env.PORT) || 3003;

const envSchema = z.object({
  WS_TOKEN: z.string().min(3),
  MONGO_URL: z.string().min(3),
});

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const start = async () => {
  const { WS_TOKEN, MONGO_URL } = envSchema.parse(process.env);
  await connectMongo(MONGO_URL);

  const authenticate = (socket: Socket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (token !== WS_TOKEN) {
      next(new Error('Unauthorized'));
      return;
    }
    next();
  };

  const chatNamespace = io.of('/chat');
  chatNamespace.use(authenticate);
  registerChatChannel(chatNamespace);

  const notificationsNamespace = io.of('/notifications');
  notificationsNamespace.use(authenticate);
  registerNotificationsChannel(notificationsNamespace);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  httpServer.listen(port, () => {
    logger.info(`WebSocket server listening on port ${port}`);
  });
};

void start();
