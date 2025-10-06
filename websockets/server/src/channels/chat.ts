import { logger } from '@realtime-labs/shared';
import { Namespace, Socket } from 'socket.io';

import { MessageModel } from '../models/Message';

export const registerChatChannel = (namespace: Namespace) => {
  namespace.on('connection', (socket: Socket) => {
    logger.info({ socketId: socket.id }, 'Client connected to chat namespace');

    socket.on('message', async (payload: { author: string; text: string }) => {
      try {
        const message = await MessageModel.create({
          author: payload.author,
          text: payload.text,
          channel: 'chat',
        });

        namespace.emit('message', {
          author: message.author,
          text: message.text,
          createdAt: message.createdAt,
        });

        logger.info({ socketId: socket.id, author: payload.author, messageId: message.id }, 'Chat message broadcasted');
      } catch (error) {
        logger.error({ err: error }, 'Failed to persist chat message');
        socket.emit('error', { message: 'Failed to persist message' });
      }
    });

    socket.on('disconnect', () => {
      logger.info({ socketId: socket.id }, 'Client disconnected from chat namespace');
    });
  });
};
