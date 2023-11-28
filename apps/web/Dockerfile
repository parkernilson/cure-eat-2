FROM node:20-alpine as build

ARG ORIGIN
ENV ORIGIN=${ORIGIN}

ARG PB_ADMIN_EMAIL
ARG PB_ADMIN_PASSWORD
ARG KROGER_SECRET
ARG PUBLIC_KROGER_CLIENT_ID
ENV PB_ADMIN_EMAIL=${PB_ADMIN_EMAIL}
ENV PB_ADMIN_PASSWORD=${PB_ADMIN_PASSWORD}
ENV KROGER_SECRET=${KROGER_SECRET}
ENV PUBLIC_KROGER_CLIENT_ID=${PUBLIC_KROGER_CLIENT_ID}

WORKDIR /home/my-app

COPY package.json ./
COPY --from=monorepo package-lock.json ./
COPY --from=monorepo apps/ ./apps/
COPY --from=monorepo packages/ ./packages/

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /opt/my-app

COPY --from=build /home/my-app/build ./build
COPY --from=build /home/my-app/package.json ./
COPY --from=build /home/my-app/node_modules/ ./node_modules

EXPOSE 3000

ENTRYPOINT ["node", "build"]