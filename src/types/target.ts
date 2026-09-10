/**
 * Supported target input types across the AOSINT platform.
 */
export type TargetType = 'DOMAIN' | 'IP' | 'USER' | 'EMAIL' | 'URL' | 'HASH';

export interface TargetMetadata {
  description?: string;
  tags?: string[];
  ownerId?: string;
  organizationId?: string;
}

export interface AssessmentTarget {
  id: string;
  value: string;
  type: TargetType;
  metadata?: TargetMetadata;
  createdAt: string;
}
