FROM alpine:3.18 AS base
LABEL org.opencontainers.image.source="https://github.com/thatgurkangurk/ttcore-uploader"
WORKDIR /app


SHELL ["/bin/bash", "-o", "pipefail", "-c"]
ENV MISE_DATA_DIR="/mise"
ENV MISE_CONFIG_DIR="/mise"
ENV MISE_CACHE_DIR="/mise/cache"
ENV MISE_INSTALL_PATH="/usr/local/bin/mise"
ENV PATH="/mise/shims:$PATH"
# ENV MISE_VERSION="..."

RUN curl https://mise.run | sh

FROM base AS deps
COPY package.json aube-lock.yaml ./
RUN mise exec -- aube ci

FROM base AS build
ENV CI=1
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN CI="1" DATABASE_URL="postgres://changeme" DISCORD_CLIENT_ID="CHANGEME" DISCORD_CLIENT_SECRET="CHANGEME" mise exec -- aube run build

FROM base
RUN addgroup -S -g 1001 nodejs \
 && adduser -S -u 1001 -G nodejs ttcore

COPY --from=build --chown=ttcore:nodejs /app/build /app/build

ENV NODE_ENV="production"
ENV HOST=0.0.0.0
ENV PORT=4321
ENV ORIGIN="https://ttcore.gurkz.me/"
EXPOSE 4321/tcp

USER ttcore

CMD ["mise", "exec", "--", "node", "./build/index.js"]
