# apps/api

Express/Fastify API Gateway.

Responsibilities:
- Auth and session management
- Routing to internal services and Base44 backend functions
- Rate limiting and request validation
- API versioning

## Suggested stack

- Node.js 20+
- Fastify (preferred) or Express
- Zod for request validation
- Pino for structured logging

## Development

```bash
cd apps/api
npm install
npm run dev
```
