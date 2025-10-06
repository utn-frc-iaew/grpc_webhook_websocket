FROM node:20-alpine3.20 AS build

WORKDIR /app

COPY package.json package-lock.json* ./
COPY shared/package.json ./shared/package.json
COPY webhooks/sender/package.json ./webhooks/sender/package.json

RUN npm install --include-workspace-root=false --workspace @realtime-labs/shared --workspace @realtime-labs/webhooks-sender

COPY . .

RUN npm run build --workspace @realtime-labs/shared && npm run build --workspace @realtime-labs/webhooks-sender
RUN npm prune --omit=dev

FROM node:20-alpine3.20 AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/shared ./shared
COPY --from=build /app/webhooks/sender/dist ./webhooks/sender/dist
COPY --from=build /app/webhooks/sender/package.json ./webhooks/sender/package.json

CMD ["node", "webhooks/sender/dist/index.js"]
