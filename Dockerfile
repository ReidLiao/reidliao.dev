FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.8 --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN pnpm config set registry https://registry.npmmirror.com && pnpm install

FROM base AS builder
ARG GIT_SHA=unknown
ARG BUILD_TIME=unknown
ENV GIT_SHA=$GIT_SHA
ENV BUILD_TIME=$BUILD_TIME
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate || true
RUN pnpm build

FROM base AS runner
WORKDIR /app
ARG GIT_SHA=unknown
ARG BUILD_TIME=unknown
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV GIT_SHA=$GIT_SHA
ENV BUILD_TIME=$BUILD_TIME
# Sanity 图片同源代理磁盘缓存（请挂 volume，避免重建容器后丢缓存）
ENV IMAGE_CACHE_DIR=/data/img-cache
RUN mkdir -p /data/img-cache
VOLUME ["/data/img-cache"]
# 👇 采用通用模式，直接拷贝所有编译好的原文件和依赖
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["pnpm", "start"]
