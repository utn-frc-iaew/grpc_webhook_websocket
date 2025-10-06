FROM node:20-alpine3.20 AS build

ARG VITE_WS_URL
ARG VITE_WS_TOKEN

WORKDIR /app

COPY package.json package-lock.json* ./
COPY websockets/client-react/package.json ./websockets/client-react/package.json

RUN npm install --include-workspace-root=false --workspace @realtime-labs/ws-client-react

COPY . .

ENV VITE_WS_URL=${VITE_WS_URL}
ENV VITE_WS_TOKEN=${VITE_WS_TOKEN}

RUN npm run build --workspace @realtime-labs/ws-client-react

FROM nginx:1.27-alpine

COPY --from=build /app/websockets/client-react/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
