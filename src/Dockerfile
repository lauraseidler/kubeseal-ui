# BASE
FROM node:19.3.0-alpine AS base

RUN apk add --no-cache curl

ARG KUBESEAL_VERSION=0.16.0
RUN curl -fsSL "https://github.com/bitnami-labs/sealed-secrets/releases/download/v${KUBESEAL_VERSION}/kubeseal-linux-amd64" \
    -o /usr/local/bin/kubeseal \
    && chmod a+x /usr/local/bin/kubeseal

WORKDIR /srv


# BUILD
FROM base AS build

COPY package*.json ./
RUN npm ci
RUN ./node_modules/.bin/remix setup node

COPY . .
RUN npm run build
RUN ls -la build


# RUNTIME
FROM base AS runtime

COPY package*.json ./
RUN npm ci --only=production

COPY --from=build /srv/build /srv/build
COPY --from=build /srv/public /srv/public

CMD [ "npm", "start" ]
