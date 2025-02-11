FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN chmod +x /app

RUN npx prisma generate

RUN npm run build

FROM node:22-alpine AS development

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/prisma ./prisma

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

CMD [ "npm", "run", "start:dev" ]

FROM node:22-alpine AS production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

CMD [ "npm", "run", "start:prod" ]