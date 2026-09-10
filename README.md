# AOSINT

Monorepo for the AOSINT platform (ASOSINT — Asaad & Shauntze's OSINT).

## Structure

```
AOSINT/
├── apps/
│   ├── web/               # Vite/React frontend (Base44 app source)
│   └── api/               # Express/Fastify API Gateway
├── packages/
│   ├── core/              # Shared TypeScript types, schemas, and utils
│   ├── osint-adapters/    # Standardized collection interface adapters
│   └── ui/                # Shared UI component library (Tailwind + Shadcn)
└── workers/
    └── collector/        # Python/Node.js worker scripts for heavy gathering
```

## Getting Started

Each package/app has its own README with setup instructions.

## License

Proprietary — All rights reserved.
