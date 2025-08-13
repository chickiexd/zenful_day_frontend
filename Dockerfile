# ----------------
# 1) Install deps
# ----------------
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ----------------
# 2) Build (standalone)
# ----------------
FROM node:18-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Must have `output: 'standalone'` in next.config.(js|ts)
RUN npm run build

# ----------------
# 3) Runtime (minimal)
# ----------------
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy the minimal standalone server produced by Next
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Remove this line if your repo has no /public folder
COPY --from=builder /app/public ./public

# Optional: run as non-root (uncomment if desired)
# RUN addgroup -g 1001 nodejs && adduser -S -u 1001 nextjs
# USER nextjs

EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
