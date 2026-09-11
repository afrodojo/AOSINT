FROM node:20-alpine AS base

WORKDIR /app

# Copy root manifests and workspace directories (turbo.json removed)
COPY package*.json ./
COPY packages/ packages/
COPY apps/api/ apps/api/

# Install dependencies and build monorepo packages
RUN npm ci
RUN npm run build --workspace=@aosint/core || true
RUN npm run build --workspace=@aosint/adapters || true
RUN npm run build --workspace=@aosint/api || true

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=@aosint/api"]
