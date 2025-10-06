import { io, Socket } from 'socket.io-client';

type Namespace = 'chat' | 'notifications';

const sockets = new Map<Namespace, Socket>();

const resolveBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_WS_URL as string | undefined;

  if (envUrl && envUrl !== 'undefined') {
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.hostname || 'localhost';
  const fallbackPort = import.meta.env.VITE_WS_PORT
    ? Number(import.meta.env.VITE_WS_PORT)
    : protocol === 'wss:'
      ? 443
      : 3003;

  const portPart = fallbackPort ? `:${fallbackPort}` : '';

  return `${protocol}//${host}${portPart}`;
};

const getBaseConfig = () => {
  const token = import.meta.env.VITE_WS_TOKEN as string | undefined;
  return {
    auth: token ? { token } : undefined,
    transports: ['websocket'],
  };
};

export const getSocket = (namespace: Namespace): Socket => {
  if (sockets.has(namespace)) {
    return sockets.get(namespace)!;
  }

  const socket = io(`${resolveBaseUrl()}/${namespace}`, getBaseConfig());
  sockets.set(namespace, socket);
  return socket;
};

export const disconnectAll = () => {
  sockets.forEach((socket) => socket.disconnect());
  sockets.clear();
};
