# JobAssist AI Studio - Production Dockerfile
FROM node:20-alpine AS base

# Install necessary runtime dependencies
WORKDIR /app

# Install dependencies first for Docker layer caching
COPY package*.json ./
RUN npm ci --only=production

# Copy source code and public assets
COPY . .

# Ensure data directory exists with write permissions
RUN mkdir -p /app/src/data

# Expose default port
EXPOSE 3001

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/premium/plans || exit 1

# Start production server
CMD ["node", "server.js"]
