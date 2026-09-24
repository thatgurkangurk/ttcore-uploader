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
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN CI="1" mise exec -- aube run build


FROM caddy:2-alpine AS runner

EXPOSE 4321

COPY --from=build /app/build /usr/share/caddy

RUN echo $':4321 {\n\
    root * /usr/share/caddy\n\
    try_files {path} /index.html\n\
    file_server\n\
}' > /etc/caddy/Caddyfile

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
