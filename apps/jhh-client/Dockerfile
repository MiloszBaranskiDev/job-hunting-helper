FROM node:18 as development

COPY package.json package-lock.json ./

RUN npm ci

FROM node:18 as production

WORKDIR /app

COPY --from=development node_modules node_modules

COPY nx.json package.json package-lock.json tsconfig.base.json ./
COPY ./libs/shared ./libs/shared
COPY ./libs/jhh-client ./libs/jhh-client
COPY ./apps/jhh-client ./apps/jhh-client

RUN npm run build:jhh-client:prod

FROM nginx:alpine

RUN apk add --no-cache bash

COPY --from=production /app/dist/apps/jhh-client/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
