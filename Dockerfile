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


FROM base AS tools
COPY mise.toml mise.lock ./
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


FROM base
RUN groupadd -g 1001 nodejs \
 && useradd -u 1001 -g nodejs -m -s /bin/bash ttcore

WORKDIR /app

RUN chown ttcore:nodejs /app

COPY --from=tools --chown=ttcore:nodejs /mise /mise

COPY --from=prod-deps --chown=ttcore:nodejs /app/node_modules /app/node_modules

COPY --from=build --chown=ttcore:nodejs /app/build /app/build
COPY --from=build --chown=ttcore:nodejs /app/mise.toml /app/mise.lock /app/.npmrc /app/package.json /app/aube-lock.yaml ./

ENV NODE_ENV="production"
ENV HOST=0.0.0.0
ENV PORT=4321
ENV ORIGIN="https://ttcore.gurkz.me/"
EXPOSE 4321/tcp

USER ttcore

ENV MISE_JOBS=1
ENV MISE_TRUSTED_CONFIG_PATHS=/app/mise.toml

CMD ["mise", "exec", "--", "node", "./build/index.js"]