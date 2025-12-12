# -------------------------
# Stage: deps (install)
# -------------------------
FROM node:18-alpine AS deps
WORKDIR /app

# install build dependencies we might need (git for some npm packages)
RUN apk add --no-cache --virtual .build-deps git ca-certificates

# copy package files first for layer caching
COPY package.json package-lock.json* ./

# install production deps only (we will use CI to run tests with dev deps)
RUN npm ci --production

# -------------------------
# Stage: builder (optional build step)
# -------------------------
FROM node:18-alpine AS builder
WORKDIR /app

# copy prod node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# copy source
COPY . .

# If you have a build step (TypeScript, babel) uncomment:
# RUN npm run build

# -------------------------
# Stage: runner (final)
# -------------------------
FROM node:18-alpine AS runner
WORKDIR /app

# Install tini for proper PID 1 handling (signal forwarding & zombies)
RUN apk add --no-cache tini

# create non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# copy only what we need from builder
# If you use build output (dist), copy dist and package.json + node_modules instead
COPY --from=builder /app ./

# set environment defaults (override at runtime)
ENV NODE_ENV=production
ENV PORT=5000

# expose port
EXPOSE 5000

# healthcheck (optional - used by many platforms / orchestrators)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5000/health || exit 1

# make sure app files are not owned by root (optional)
RUN chown -R appuser:appgroup /app

USER appuser

# use tini as init to handle signals correctly
ENTRYPOINT ["/sbin/tini", "--"]
CMD [ "node", "src/index.js" ]
