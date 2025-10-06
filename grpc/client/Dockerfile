FROM node:20-alpine3.20 AS build

WORKDIR /app

COPY package.json package-lock.json* ./
COPY grpc/client/package.json ./grpc/client/package.json

RUN npm install --include-workspace-root=false --workspace @realtime-labs/grpc-client

COPY . .

RUN npm run build --workspace @realtime-labs/grpc-client
RUN npm prune --omit=dev

FROM node:20-alpine3.20 AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/grpc/client/dist ./grpc/client/dist
COPY --from=build /app/grpc/client/proto ./grpc/client/proto
COPY --from=build /app/grpc/client/package.json ./grpc/client/package.json

CMD ["node", "grpc/client/dist/index.js"]
