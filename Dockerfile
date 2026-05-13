FROM debian:13-slim AS builder-base

WORKDIR /app

ENV MISE_DATA_DIR="/mise"
ENV MISE_CONFIG_DIR="/mise"
ENV MISE_CACHE_DIR="/mise/cache"
ENV MISE_ALL_COMPILE="false"
ENV PATH="/mise/shims:$PATH"

RUN apt-get update \
    && apt-get -y --no-install-recommends install curl ca-certificates gnupg \
    && install -dm 755 /etc/apt/keyrings \
    && curl -fSs https://mise.en.dev/gpg-key.pub | tee /etc/apt/keyrings/mise-archive-keyring.asc 1> /dev/null \
    && echo "deb [signed-by=/etc/apt/keyrings/mise-archive-keyring.asc] https://mise.en.dev/deb stable main" | tee /etc/apt/sources.list.d/mise.list \
    && apt-get update \
    && apt-get -y --no-install-recommends install mise \
    && rm -rf /var/lib/apt/lists/*


FROM builder-base AS tools
COPY mise.toml mise.lock ./

RUN mise trust . && \
    mise install && \
    mise cache clean && \
    rm -rf /mise/cache /mise/downloads


FROM tools AS deps
COPY package.json aube-lock.yaml .npmrc ./
RUN mise exec -- aube ci


FROM tools AS prod-deps
COPY package.json aube-lock.yaml .npmrc ./
RUN mise exec -- aube install --frozen-lockfile --prod --no-optional


FROM tools AS build
ENV CI="1"
ENV DATABASE_URL="postgres://changeme"
ENV BETTER_AUTH_SECRET="changeme"
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN CI="1" mise exec -- aube run build


FROM debian:13-slim AS runner

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd -g 1001 nodejs \
 && useradd -u 1001 -g nodejs -m -s /bin/bash ttcore

WORKDIR /app

ENV MISE_DATA_DIR="/mise"
ENV MISE_CONFIG_DIR="/mise"
ENV PATH="/mise/shims:$PATH"
ENV MISE_JOBS=1
ENV MISE_TRUSTED_CONFIG_PATHS=/app/mise.toml
ENV NODE_ENV="production"
ENV HOST=0.0.0.0
ENV PORT=4321
ENV ORIGIN="https://ttcore.gurkz.me/"

COPY --from=tools /usr/bin/mise /usr/local/bin/mise
COPY --from=tools --chown=ttcore:nodejs /mise /mise

COPY --from=prod-deps --chown=ttcore:nodejs /app/node_modules /app/node_modules
COPY --from=build --chown=ttcore:nodejs /app/build /app/build
COPY --from=build --chown=ttcore:nodejs /app/mise.toml /app/mise.lock /app/.npmrc /app/package.json /app/aube-lock.yaml ./

EXPOSE 4321/tcp
USER ttcore

CMD ["mise", "exec", "--", "node", "./build/index.js"]