# =====================================================
# DAHUA DUBAI - PRODUCTION DOCKERFILE
# Multi-stage build for optimized production image
# =====================================================

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install libc6-compat for Alpine compatibility
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install --legacy-peer-deps

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=8088
ENV JWT_SECRET=e2aa6f235d73864329f81559a4a66d7d
ENV ADMIN_EMAIL=admin@dahuva.com
ENV ADMIN_PASSWORD=password123
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dhkf6dhvd
ENV CLOUDINARY_API_KEY=991453858581113
ENV CLOUDINARY_API_SECRET=NdK3TIA7UweDA4Bw13xlKdKmPU4
ENV NEXT_PUBLIC_API_URL=https://dahua-dubai.com
ENV NEXT_PUBLIC_SUPABASE_URL=https://aijmdajuebprtroohuos.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpam1kYWp1ZWJwcnRyb29odW9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MDUzNTIsImV4cCI6MjA4MzE4MTM1Mn0.FXxoC2rqTSrG2YgsJG9bMmGuR71gZi9kerSXkB86v10
ENV SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpam1kYWp1ZWJwcnRyb29odW9zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzYwNTM1MiwiZXhwIjoyMDgzMTgxMzUyfQ.21I9GMBEAeGKyRBvfvl9owrVZtsIzfTx4qMr3COoh0s

# Build the Next.js application
RUN npm run build

# Stage 3: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8088
ENV HOSTNAME="0.0.0.0"
ENV JWT_SECRET=e2aa6f235d73864329f81559a4a66d7d
ENV ADMIN_EMAIL=admin@dahuva.com
ENV ADMIN_PASSWORD=password123
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dhkf6dhvd
ENV CLOUDINARY_API_KEY=991453858581113
ENV CLOUDINARY_API_SECRET=NdK3TIA7UweDA4Bw13xlKdKmPU4
ENV NEXT_PUBLIC_API_URL=https://dahua-dubai.com
ENV NEXT_PUBLIC_SUPABASE_URL=https://aijmdajuebprtroohuos.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpam1kYWp1ZWJwcnRyb29odW9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MDUzNTIsImV4cCI6MjA4MzE4MTM1Mn0.FXxoC2rqTSrG2YgsJG9bMmGuR71gZi9kerSXkB86v10
ENV SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpam1kYWp1ZWJwcnRyb29odW9zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzYwNTM1MiwiZXhwIjoyMDgzMTgxMzUyfQ.21I9GMBEAeGKyRBvfvl9owrVZtsIzfTx4qMr3COoh0s

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Set correct permissions for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy standalone build output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 8088

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8088/api/health', (r) => { if (r.statusCode !== 200) throw new Error(); }).on('error', () => { throw new Error(); })"
# Use dumb-init as entrypoint
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]
