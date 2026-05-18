FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

# Placeholder so prisma generate doesn't connect to DB during build
ENV DATABASE_URL=postgresql://placeholder:placeholder@localhost/placeholder

# Build script: npx prisma generate && nest build
# generate creates src/generated/prisma/*.ts which TypeScript then compiles into dist/
RUN npm run build

# ─── Production image ─────────────────────────────────────────────────────────
FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma/

# Install all deps — prisma (devDep) is needed at startup for migrate deploy
RUN npm ci

# Copy compiled app (includes dist/generated/prisma/ compiled from TypeScript)
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/main"]
