# Base Image
FROM node:20-alpine AS base

WORKDIR /app

# Copy page.json and package-lock.json and install dependencies
COPY package.json package-lock.json ./

RUN \
  if [ -f package-lock.json]; then \
    npm ci; \
  else \
    npm install; \
  fi

  # Build the app
FROM base AS builder

WORKDIR /app

COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Set the environment variable
ENV NEXT_PUBLIC_BACKEND_URL "http://ohgetsu-server:8080"

# Build the Next.js app
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner

WORKDIR /app

# Set the environment to production
ENV NODE_ENV production

# Create a user group and user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set permissions
RUN chown nextjs:nodejs .next

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Set the environment variables
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Run the Next.js app
CMD ["node", "server.js"]
