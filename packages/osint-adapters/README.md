# packages/osint-adapters

Standardized collection interface adapters for OSINT data sources.

Each adapter implements a common interface so collectors and the API
gateway can consume them uniformly.

## Supported adapters (planned)

- Shodan
- VirusTotal
- AlienVault OTX
- AbuseIPDB
- HaveIBeenPwned
- Custom webhook sources

## Adapter interface

```ts
export interface OsintAdapter {
  name: string;
  collect(query: AdapterQuery): Promise<AdapterResult>;
  normalize(raw: unknown): NormalizedFinding;
}
```
