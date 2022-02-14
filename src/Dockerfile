FROM node:17.4.0-alpine

RUN apk add --no-cache curl

ARG KUBESEAL_VERSION=0.16.0
RUN curl -fsSL "https://github.com/bitnami-labs/sealed-secrets/releases/download/v${KUBESEAL_VERSION}/kubeseal-linux-amd64" \
    -o /usr/local/bin/kubeseal \
    && chmod a+x /usr/local/bin/kubeseal
