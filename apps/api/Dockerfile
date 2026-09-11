# apps/api/Dockerfile
FROM node:20-alpine AS base

WORKDIR /app

# Copy root monorepo package manifests
COPY package*.json ./
COPY packages/ packages/
COPY apps/api/ apps/api/

# Install workspace dependencies and build packages
RUN npm ci
RUN npm run build --workspace=@aosint/core || true
RUN npm run build --workspace=@aosint/adapters || true
RUN npm run build --workspace=@aosint/api || true

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=@aosint/api"]
