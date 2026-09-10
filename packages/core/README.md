# packages/core

Shared TypeScript types, schemas, and utilities used across the monorepo.

## Contents

- `types/` — Shared TypeScript type definitions (ThreatEvent, IOC, Asset, etc.)
- `schemas/` — Zod / JSON schemas for validation
- `utils/` — Pure utility functions (date, string, math helpers)
- `constants/` — Shared constants and enums

## Usage

```ts
import { ThreatEventSchema, severityLevels } from '@aosint/core';
```
