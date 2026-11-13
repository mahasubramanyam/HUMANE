# ==============================================================================
# HUMANE — Frontend Production Dockerfile (Next.js 15 Standalone)
# Target: Azure Container Apps / Docker
# ==============================================================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
COPY scripts ./scripts
RUN npm ci

# --- Builder Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Enable standalone output and embed public build-time configuration
ARG NEXT_PUBLIC_APP_NAME=HUMANE
ARG NEXT_PUBLIC_APP_ENV=production
ARG NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV DOCKER_BUILD=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Reject explicit localhost URLs when building for production
RUN if [ "$NODE_ENV" = "production" ] && echo "$NEXT_PUBLIC_API_URL" | grep -Eq 'https?://(localhost|127\.0\.0\.1)(:[0-9]+)?'; then \
      echo "ERROR: Production image cannot be built with a localhost API URL ($NEXT_PUBLIC_API_URL). Pass a valid production backend URL (e.g. --build-arg NEXT_PUBLIC_API_URL=https://<backend-fqdn>/api/v1) or omit it to leverage dynamic runtime injection." >&2; \
      exit 1; \
    fi

RUN npm run build

# --- Runner Stage ---
FROM node:20-alpine AS runner
WORKDIR /app

ARG NEXT_PUBLIC_APP_NAME=HUMANE
ARG NEXT_PUBLIC_APP_ENV=production
ARG NEXT_PUBLIC_API_URL
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1:3000/ > /dev/null || exit 1

CMD ["node", "server.js"]
