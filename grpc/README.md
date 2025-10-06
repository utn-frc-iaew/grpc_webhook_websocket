# gRPC Lab

Este laboratorio demuestra comunicación unary, server-streaming y bidirectional-streaming sobre gRPC utilizando Node.js y TypeScript.

## Servicios

- **Server**: expone `CreateOrder`, `GetOrders` y `ChatOrders`, persiste órdenes en MongoDB y transmite eventos en tiempo real.
- **Client**: CLI interactiva para invocar los distintos métodos del servicio.

## Scripts útiles

```bash
npm run dev --workspace @realtime-labs/grpc-server
npm run test --workspace @realtime-labs/grpc-server
npm run dev --workspace @realtime-labs/grpc-client
```

## Docker Compose

```bash
docker compose --profile grpc up -d
```

## Ejercicios sugeridos

1. Agregar un método client-streaming para carga masiva de órdenes.
2. Incorporar logs estructurados y métricas por cada RPC.
3. Añadir autenticación con tokens firmados.
