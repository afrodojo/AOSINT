# apps/api/Dockerfile
FROM node:20-alpine AS base

WORKDIR /app

# Copy monorepo configuration
COPY package*.json ./
COPY packages/ packages/
COPY apps/api/ apps/api/

# Install workspace dependencies and build core packages
RUN npm ci
RUN npm run build --workspace=@aosint/core --workspace=@aosint/adapters || npm run build

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=@aosint/api"]
