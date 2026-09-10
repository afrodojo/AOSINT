import { TargetType } from './target';

export type FindingCategory =
  | 'INFRASTRUCTURE'
  | 'VULNERABILITY'
  | 'BREACH'
  | 'SUBDOMAIN'
  | 'SOCIAL_PROFILE'
  | 'METADATA'
  | 'CREDENTIAL'
  | 'THREAT_INTEL';

export interface IntelligenceFinding {
  /** Unique UUID v4 for the finding */
  id: string;
  /** Assessment Job ID that generated this finding */
  jobId?: string;
  /** The target string that was queried (e.g., "1.1.1.1" or "example.com") */
  target: string;
  /** High-level category of intelligence */
  entityType: FindingCategory;
  /** Name of the adapter/tool that collected this finding (e.g., "shodan", "haveibeenpwned") */
  source: string;
  /** Confidence rating from 0 (unverified) to 100 (high fidelity) */
  confidence: number;
  /** Normalized metadata/payload extracted by the adapter */
  data: Record<string, unknown>;
  /** ISO-8601 Timestamp when the finding was recorded */
  timestamp: string;
}

export interface FindingFilter {
  jobId?: string;
  target?: string;
  source?: string;
  entityType?: FindingCategory;
  minConfidence?: number;
}
