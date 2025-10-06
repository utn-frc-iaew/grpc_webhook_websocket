# WebSockets Lab

Laboratorio de WebSockets con Socket.IO para canales de chat y notificaciones, acompañado de una aplicación cliente en React con Vite.

## Servicios

- **Server**: administra namespaces `chat` y `notifications`, valida tokens y emite actualizaciones.
- **Client React**: proporciona interfaz de chat en tiempo real y panel de notificaciones.

## Scripts útiles

```bash
npm run dev --workspace @realtime-labs/ws-server
npm run test --workspace @realtime-labs/ws-server
npm run dev --workspace @realtime-labs/ws-client-react
```

## Docker Compose

```bash
docker compose --profile websockets up -d
```

## Ejercicios sugeridos

1. Persistir histórico de mensajes en MongoDB.
2. Añadir paginación y scroll infinito al chat.
3. Implementar métricas de conexión y reconexión.
