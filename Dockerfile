# ----------------
# 1. Builder stage
# ----------------
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Build the Next.js application
RUN npm run build

# ----------------
# 2. Production stage
# ----------------
FROM node:18-alpine AS runner

WORKDIR /app

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy build output from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# If using Next.js with custom server code, copy it too
# COPY --from=builder /app/server.js ./server.js

# Expose port 3000 for Next.js
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
