# workers/collector/Dockerfile
FROM node:20-alpine AS base

WORKDIR /app

# Copy monorepo configuration
COPY package*.json turbo.json ./
COPY packages/ packages/
COPY workers/collector/ workers/collector/

# Install workspace dependencies and build core packages
RUN npm ci
RUN npm run build --filter=@aosint/core --filter=@aosint/adapters --filter=@aosint/collector-worker

CMD ["npm", "run", "start", "--workspace=@aosint/collector-worker"]
