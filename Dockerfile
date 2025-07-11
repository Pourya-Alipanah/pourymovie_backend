# build stage
FROM node:22.15.0-alpine as builder

RUN npm install -g pnpm@latest-10

WORKDIR /app

COPY package*.json ./
COPY pnpm*.* ./
RUN pnpm install

COPY . .

RUN pnpm build

# production stage
FROM node:22.15.0-alpine

RUN npm install -g pnpm@latest-10

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/pnpm*.* ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 1406

COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]