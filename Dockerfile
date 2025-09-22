# Use Node.js 24 Alpine image
FROM node:24-alpine AS base

# Install pnpm and required system dependencies for Prisma
RUN npm install -g pnpm && \
    apk add --no-cache openssl libc6-compat

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/

# Copy lockfile if it exists
COPY pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build applications
RUN pnpm build

# Production stage
FROM node:24-alpine AS production

# Install pnpm and required system dependencies for Prisma
RUN npm install -g pnpm && \
    apk add --no-cache openssl libc6-compat

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/config/package.json ./packages/config/

# Copy lockfile if it exists
COPY pnpm-lock.yaml* ./

# Install all dependencies (including dev) for Prisma generation
RUN pnpm install --frozen-lockfile

# Copy packages source and build config
COPY packages/config ./packages/config
RUN pnpm --filter @linea/config build

# Copy built applications
COPY --from=base /app/apps/web/dist ./apps/web/dist
COPY --from=base /app/apps/api/dist ./apps/api/dist
COPY --from=base /app/apps/api/prisma ./apps/api/prisma

# Copy runtime configuration files
COPY config ./config

# Generate Prisma client
RUN pnpm --filter @linea/api db:generate

# Remove dev dependencies to reduce image size
RUN pnpm prune --prod

# Set environment variables
ENV NODE_ENV=production
ENV PORT=9030

# Expose port
EXPOSE 9030

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:9030/health || exit 1

# Start the API server
CMD ["pnpm", "--filter", "@linea/api", "start"]
