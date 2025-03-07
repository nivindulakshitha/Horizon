# Multi-stage build for Horizon Financial SaaS Platform

# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies for Plaid and other packages that might need building
RUN apk add --no-cache python3 make g++

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Set up environment for production build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build the Next.js application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

# Set to production environment
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user to run the app
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from the build stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose the port
EXPOSE 3000

# Define the command to run the app - use start instead of dev for production
CMD ["npm", "start"]