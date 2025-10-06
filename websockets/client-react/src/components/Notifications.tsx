import { useEffect, useState } from 'react';

import { getSocket } from '../api/socket';

interface NotificationMessage {
  orderId: string;
  status: string;
  emittedAt: string;
}

export const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  useEffect(() => {
    const socket = getSocket('notifications');
    const handler = (message: NotificationMessage) => {
  setNotifications((prev: NotificationMessage[]) => [message, ...prev].slice(0, 10));
    };

    socket.on('order:update', handler);

    return () => {
      socket.off('order:update', handler);
    };
  }, []);

  return (
    <section>
      <h2>Notificaciones</h2>
      <ul>
  {notifications.map((notification: NotificationMessage, index: number) => (
          <li key={`${notification.orderId}-${index}`}>
            Orden {notification.orderId}: {notification.status} •{' '}
            {new Date(notification.emittedAt).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </section>
  );
};
