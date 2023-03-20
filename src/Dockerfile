# BASE
FROM node:19.8.1-alpine AS base

RUN apk add --no-cache curl

# renovate: datasource=github-releases depName=bitnami-labs/sealed-secrets
ARG KUBESEAL_VERSION=v0.20.2
RUN curl -fsSL "https://github.com/bitnami-labs/sealed-secrets/releases/download/${KUBESEAL_VERSION}/kubeseal-${KUBESEAL_VERSION#?}-linux-amd64.tar.gz" \
    -o /tmp/kubeseal.tar.gz \
    && tar xf /tmp/kubeseal.tar.gz -C /usr/local/bin kubeseal \
    && rm -rf /tmp/* \
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
