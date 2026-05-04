FROM debian:13-slim AS base

LABEL org.opencontainers.image.source="https://github.com/thatgurkangurk/ttcore-uploader"
WORKDIR /app

ENV MISE_DATA_DIR="/mise"
ENV MISE_CONFIG_DIR="/mise"
ENV MISE_CACHE_DIR="/mise/cache"
ENV MISE_INSTALL_PATH="/usr/local/bin/mise"
ENV MISE_ALL_COMPILE="false"
ENV PATH="/mise/shims:$PATH"
# ENV MISE_VERSION="..."


RUN apt-get update  \
    && apt-get -y --no-install-recommends install  \
        sudo curl git ca-certificates build-essential \
    && rm -rf /var/lib/apt/lists/*

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN curl https://mise.run | sh

FROM base AS deps
COPY package.json aube-lock.yaml ./
COPY mise.toml mise.lock .npmrc ./

RUN mise trust .
RUN mise exec -- aube ci

FROM base AS build
ENV CI=1
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN CI="1" BETTER_AUTH_SECRET="changeme" DATABASE_URL="postgres://changeme" DISCORD_CLIENT_ID="CHANGEME" DISCORD_CLIENT_SECRET="CHANGEME" mise exec -- aube run build

FROM base
RUN groupadd -g 1001 nodejs \
 && useradd -u 1001 -g nodejs -m -s /bin/bash ttcore

COPY --from=build --chown=ttcore:nodejs /app/build /app/build
COPY --from=build --chown=ttcore:nodejs /app/mise.toml /app/mise.lock /app/.npmrc ./

RUN mise trust /app/mise.toml

ENV NODE_ENV="production"
ENV HOST=0.0.0.0
ENV PORT=4321
ENV ORIGIN="https://ttcore.gurkz.me/"
EXPOSE 4321/tcp

USER ttcore

CMD ["sh", "-c", "mise trust /app/mise.toml && mise exec -- node ./build/index.js"]