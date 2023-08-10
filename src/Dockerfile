# BASE
# Do not use an alpine image (https://martinheinz.dev/blog/92)
FROM node:20.5.1-bookworm-slim AS base

RUN apt-get update && apt-get install -y \
    curl \
    dumb-init \
    procps

# renovate: datasource=github-releases depName=bitnami-labs/sealed-secrets
ARG KUBESEAL_VERSION=v0.23.0
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

# https://engineeringblog.yelp.com/2016/01/dumb-init-an-init-for-docker.html
CMD [ "dumb-init", "./node_modules/.bin/remix-serve", "build" ]
