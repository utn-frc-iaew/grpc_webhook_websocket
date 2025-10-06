import { logger } from '@realtime-labs/shared';
import { Namespace, Socket } from 'socket.io';

export const registerNotificationsChannel = (namespace: Namespace) => {
  namespace.on('connection', (socket: Socket) => {
    logger.info({ socketId: socket.id }, 'Client connected to notifications namespace');

    socket.on('order:update', (payload: { orderId: string; status: string }) => {
      namespace.emit('order:update', {
        ...payload,
        emittedAt: new Date().toISOString(),
      });
    });
  });
};
