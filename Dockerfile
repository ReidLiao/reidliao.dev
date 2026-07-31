# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.8 --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN pnpm config set registry https://registry.npmmirror.com && pnpm install

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# .env 不进镜像层：构建时用 BuildKit secret 注入（见下方 docker build 命令）
# 若未提供 secret，则跳过校验以便至少能完成构建（NEXT_PUBLIC_* 仍建议通过 secret 提供）
ENV SKIP_ENV_VALIDATION=1
RUN --mount=type=secret,id=env,required=false,target=/run/secrets/.env \
  if [ -f /run/secrets/.env ]; then \
    set -a && . /run/secrets/.env && set +a && \
    unset SKIP_ENV_VALIDATION && \
    pnpm build; \
  else \
    echo "WARN: no env secret mounted; building with SKIP_ENV_VALIDATION=1"; \
    pnpm build; \
  fi

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Sanity 图片同源代理磁盘缓存（请挂 volume，避免重建容器后丢缓存）
ENV IMAGE_CACHE_DIR=/data/img-cache
RUN mkdir -p /data/img-cache
VOLUME ["/data/img-cache"]
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["pnpm", "start"]
