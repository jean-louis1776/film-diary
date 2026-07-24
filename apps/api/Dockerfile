# Public read-only API (Fastify + TypeScript), multi-stage build, non-root.
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:24-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM node:24-alpine AS prod-deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

FROM node:24-alpine
ENV NODE_ENV=production
WORKDIR /app
USER node
COPY --chown=node:node --from=prod-deps /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node package.json ./
EXPOSE 3001
CMD ["node", "dist/server.js"]
