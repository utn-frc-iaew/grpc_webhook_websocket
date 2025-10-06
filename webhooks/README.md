# Webhooks Lab

Este laboratorio incluye un Receiver y un Sender que trabajan juntos para simular eventos webhooks firmados y persistidos en MongoDB.

## Servicios

- **Receiver**: API HTTP que expone `POST /webhooks/:provider`, valida la firma HMAC-SHA256, previene replay attacks y almacena eventos.
- **Sender**: CLI que firma eventos demo y los reenvía al Receiver con backoff exponencial en caso de fallo.

## Scripts principales

```bash
npm run dev -w webhooks/receiver
npm run test -w webhooks/receiver
npm run dev -w webhooks/sender
```

## Docker Compose local

```bash
docker compose --profile webhooks up -d
```

## Ejercicios sugeridos

1. Agregar nuevos handlers específicos por proveedor.
2. Implementar rotación de secretos y almacenamiento seguro.
3. Extender métricas y observabilidad.
