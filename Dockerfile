# ── Build stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps first (layer cached unless package.json changes)
COPY package*.json ./
RUN npm ci

# Copy source files needed for build
COPY prisma ./prisma/
COPY src ./src/
COPY tsconfig.json tsconfig.build.json nest-cli.json prisma.config.ts ./

# Placeholder so prisma generate doesn't error on missing DATABASE_URL
ENV DATABASE_URL=postgresql://placeholder:placeholder@localhost/placeholder

# Build runs: prisma generate && nest build
RUN npm run build

# Remove dev dependencies to slim down the layer we copy to production
RUN npm prune --omit=dev

# ── Production stage ───────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# Pruned node_modules already contains the generated @prisma/client types
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "dist/main"]
