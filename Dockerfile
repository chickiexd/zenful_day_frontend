# ----------------
# 1. Builder stage
# ----------------
FROM node:18-alpine AS builder
WORKDIR /app

# Accept build-time secrets (from compose build args)
ARG BETTER_AUTH_SECRET
ARG BETTER_AUTH_URL
ARG DATABASE_URL
ARG GO_API_URL
ARG NEXT_PUBLIC_GO_API_URL

# Install deps (better caching)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

RUN npm run build

# ----------------
# 2. Production stage
# ----------------
FROM node:18-alpine AS runner
WORKDIR /app

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Install only production deps
COPY package*.json ./
RUN npm ci --only=production

# Copy build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./
# Only copy public if your repo actually has it. Remove for now to avoid build failure.
# COPY --from=builder /app/public ./public

# Expose port 3000
EXPOSE 3000

# Start Next.js
CMD ["npm", "start"]

