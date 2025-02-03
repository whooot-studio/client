# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .
RUN npm run generate

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

RUN npm install -g serve@14.2.4

COPY --from=builder /app/.output ./.output

ENV NODE_ENV=production
CMD ["npx", "serve", ".output/public"]