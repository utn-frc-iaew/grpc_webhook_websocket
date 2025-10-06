import { logger } from '@realtime-labs/shared';
import { io } from 'socket.io-client';

type OrderNotificationPayload = {
  orderId: string;
  status: string;
};

const resolveConfig = () => {
  const url = process.env.WS_SERVER_URL;
  const token = process.env.WS_TOKEN;

  if (!url || !token) {
    logger.warn('WS notifications disabled: missing WS_SERVER_URL or WS_TOKEN');
    return null;
  }

  return { url, token };
};

export const emitOrderNotification = async (payload: OrderNotificationPayload) => {
  const config = resolveConfig();
  if (!config) {
    return;
  }

  const { url, token } = config;

  await new Promise<void>((resolve) => {
    const socket = io(url, {
      auth: { token },
      transports: ['websocket'],
      forceNew: true,
    });

    let settled = false;

    const cleanup = () => {
      if (!settled) {
        settled = true;
        socket.disconnect();
        resolve();
      }
    };

    socket.on('connect', () => {
      logger.info({ orderId: payload.orderId, status: payload.status }, 'Emitting WebSocket notification');
      socket.emit('order:update', {
        ...payload,
        emittedAt: new Date().toISOString(),
      });
      cleanup();
    });

    socket.on('connect_error', (error) => {
      logger.error({ err: error }, 'Failed to connect to notifications namespace');
      cleanup();
    });

    socket.on('error', (error) => {
      logger.error({ err: error }, 'WebSocket notification error');
      cleanup();
    });

    setTimeout(() => {
      if (!settled) {
        logger.warn('Timeout connecting to notifications namespace');
        cleanup();
      }
    }, 5000);
  });
};
