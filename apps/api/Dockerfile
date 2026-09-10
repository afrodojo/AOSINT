# apps/api/Dockerfile
FROM node:20-alpine AS base

WORKDIR /app

# Copy monorepo configuration
COPY package*.json turbo.json ./
COPY packages/ packages/
COPY apps/api/ apps/api/

# Install workspace dependencies and build core packages
RUN npm ci
RUN npm run build --filter=@aosint/core --filter=@aosint/adapters --filter=@aosint/api

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=@aosint/api"]
