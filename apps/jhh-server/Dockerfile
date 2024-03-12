FROM node:18 as development

WORKDIR /app

COPY nx.json package.json package-lock.json tsconfig.base.json ./
COPY prisma ./prisma
COPY ./libs/shared ./libs/shared
COPY ./libs/jhh-server ./libs/jhh-server
COPY ./apps/jhh-server ./apps/jhh-server

RUN npm ci
RUN npm run build:jhh-server:prod

FROM node:18 as production

WORKDIR /app

COPY package.json package-lock.json ./
COPY --from=development /app/dist/apps/jhh-server/main.js main.js

RUN npm ci --prod

EXPOSE 3000

CMD ["node", "main.js"]
