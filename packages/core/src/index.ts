// packages/core/src/index.ts
export type TargetType = 'DOMAIN' | 'IP' | 'USER' | 'EMAIL' | 'URL' | 'HASH';

export interface IntelligenceFinding {
  id: string;
  jobId?: string;
  target: string;
  entityType: 'INFRASTRUCTURE' | 'VULNERABILITY' | 'BREACH' | 'SUBDOMAIN' | 'SOCIAL_PROFILE';
  source: string;
  confidence: number;
  data: Record<string, unknown>;
  timestamp: string;
}

export interface AssessmentJob {
  jobId: string;
  target: string;
  targetType: TargetType;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  progress: number;
  createdAt: string;
  updatedAt: string;
  options?: {
    adapters?: string[];
    priority?: number;
  };
}
