FROM alpine:3.18 AS base
LABEL org.opencontainers.image.source="https://github.com/thatgurkangurk/ttcore-uploader"
WORKDIR /app

RUN apk add --no-cache curl ca-certificates bash build-base git \
 && curl -fsSL https://mise.run | sh \
 && mise --version

FROM base AS deps
COPY package.json aube-lock.yaml ./
RUN aube ci

FROM base AS build
ENV CI=1
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN CI="1" DATABASE_URL="postgres://changeme" DISCORD_CLIENT_ID="CHANGEME" DISCORD_CLIENT_SECRET="CHANGEME" aube run build

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
