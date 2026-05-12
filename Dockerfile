FROM alpine:3.20 AS base

LABEL org.opencontainers.image.source="https://github.com/thatgurkangurk/ttcore-uploader"
WORKDIR /app

ENV MISE_LIBC="musl"
ENV MISE_BASE_DIR="/opt/mise"
ENV MISE_DATA_DIR="/opt/mise/data"
ENV MISE_CONFIG_DIR="/opt/mise/config"
ENV MISE_CACHE_DIR="/opt/mise/cache"
ENV MISE_INSTALL_PATH="/usr/local/bin/mise"
ENV PATH="/opt/mise/data/shims:$PATH"

RUN apk add --no-cache \
    sudo \
    curl \
    git \
    ca-certificates \
    build-base \
    bash \
    gcompat \
    libstdc++

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN curl https://mise.run | sh


FROM base AS tools
COPY mise.toml mise.lock ./

RUN mise settings node.mirror_url=https://unofficial-builds.nodejs.org/download/release/
RUN mise settings node.flavor=musl

RUN mise trust . && mise install


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


FROM alpine:3.20 AS runner

RUN apk add --no-cache bash gcompat libstdc++

RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S ttcore -G nodejs -s /bin/bash

WORKDIR /app
RUN chown ttcore:nodejs /app

COPY --from=tools --chown=ttcore:nodejs /opt/mise /opt/mise
COPY --from=tools --chown=ttcore:nodejs /usr/local/bin/mise /usr/local/bin/mise

COPY --from=prod-deps --chown=ttcore:nodejs /app/node_modules /app/node_modules
COPY --from=build --chown=ttcore:nodejs /app/build /app/build
COPY --from=build --chown=ttcore:nodejs /app/mise.toml /app/mise.lock /app/.npmrc /app/package.json /app/aube-lock.yaml ./

ENV NODE_ENV="production"
ENV HOST=0.0.0.0
ENV PORT=4321
ENV ORIGIN="https://ttcore.gurkz.me/"
EXPOSE 4321/tcp

USER ttcore

ENV MISE_LIBC="musl"
ENV MISE_DATA_DIR="/opt/mise/data"
ENV MISE_CONFIG_DIR="/opt/mise/config"
ENV PATH="/opt/mise/data/shims:$PATH"
ENV MISE_TRUSTED_CONFIG_PATHS=/app/mise.toml

CMD ["mise", "exec", "--", "node", "./build/index.js"]
