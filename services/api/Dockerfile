# ==========================================
# YaatraSangi Backend API Dockerfile
# Multi-stage production build
# ==========================================

# Stage 1: Build & Dependencies
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Install OpenSSL for Prisma and build tools for native addons
RUN apt-get update -y && apt-get install -y openssl ca-certificates python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (including devDependencies for nest build)
RUN npm ci

# Generate Prisma Client (supports postgres in production)
RUN npx prisma generate --schema=prisma/schema.prisma

COPY tsconfig*.json nest-cli.json ./
COPY src ./src/

# Compile TypeScript
RUN npm run build

# Prune dev dependencies for production image
RUN npm prune --production

# Stage 2: Production Runtime
FROM node:20-bookworm-slim AS runner

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3001

# Run as non-root node user
USER node

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/prisma ./prisma

EXPOSE 3001

CMD ["node", "dist/main.js"]

