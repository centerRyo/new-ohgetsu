# Base image
FROM node:20-alpine AS base

WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package.json package-lock.json ./

# to generate prisma client need to npm install
RUN npm install

# Copy prisma schema and run prisma generate
COPY prisma ./prisma
RUN npx prisma generate

# Build the app
FROM base AS builder

WORKDIR /app

COPY . .

# Build the Nest.js app
RUN npm run build

# Production image, copy all the files and run nest
FROM base AS runner

WORKDIR /app

# Set the environment to production
ENV NODE_ENV production

# Create a user group and user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Set permissions
RUN chown nestjs:nodejs dist

# Switch to non-root user
USER nestjs

EXPOSE 8080

# Set the environment variables
ENV PORT 8080
# The application listens on all network interfaces
ENV HOSTNAME "0.0.0.0"

# Run the Nest.js app
CMD ["node", "dist/src/main.js"]

