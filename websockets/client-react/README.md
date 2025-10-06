# Realtime Labs WebSockets Client

Aplicación React + Vite que visualiza las notificaciones y el chat en vivo emitidos por el servidor Socket.IO del laboratorio. Está pensada para que los alumnos exploren cómo se conectan los diferentes dominios en tiempo real desde una interfaz amigable.

## Requisitos

- Node.js 20.x y npm >= 9 (si corrés el proyecto fuera de Docker).
- Servicios de WebSockets disponibles en `ws://localhost:3003` o variables de entorno equivalentes.

> Si levantas todo con `docker compose --profile websockets up`, el contenedor de Nginx sirve esta aplicación ya construida y con las variables configuradas.

## Scripts principales

| Comando | Descripción |
| --- | --- |
| `npm install` | Instala dependencias (desde la raíz del monorepo con workspaces o dentro de esta carpeta). |
| `npm run dev` | Inicia Vite en modo desarrollo con hot reload. |
| `npm run build` | Genera la versión optimizada en `dist/`. |
| `npm run preview` | Levanta la build generada para validarla localmente. |

Desde la raíz del monorepo también podés usar el alias `npm run dev:websockets`, que lanza tanto el servidor Socket.IO como este cliente en paralelo.

## Variables de entorno

La aplicación acepta las siguientes variables (todas opcionales; el fallback detecta automáticamente el host y puerto desde `window.location`):

- `VITE_WS_URL`: URL completa al servidor de WebSockets (por ejemplo `ws://localhost:3003`). Si termina en `/`, se recorta automáticamente.
- `VITE_WS_PORT`: Puerto a utilizar cuando sólo querés sobreescribir el valor por defecto `3003`.
- `VITE_WS_TOKEN`: Token que se envía en el handshake de Socket.IO (`auth.token`). Por defecto el compose inyecta `demo-token`.

Podés definirlas en un archivo `.env.local` (ignorando al sistema de control de versiones) o exportarlas en tu shell antes de correr `npm run dev`.

## Flujo de interacción

1. El cliente abre dos namespaces: `chat` y `notifications`.
2. Las órdenes emitidas desde Webhooks o gRPC llegan como eventos `order:update` al namespace `notifications`.
3. Los mensajes escritos desde la UI se envían al namespace `chat` y el servidor Socket.IO los propaga al resto de las pestañas conectadas.

Explorá las pestañas “Chat” y “Notificaciones” para validar que el servidor refleja los cambios en tiempo real mientras ejecutás los escenarios del README principal.
