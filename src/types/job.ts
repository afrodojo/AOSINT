import { TargetType } from './target';

export type JobStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface AssessmentJobOptions {
  adapters?: string[]; // Specific adapters to run; runs all matching if omitted
  timeoutSeconds?: number;
  priority?: number; // Queue priority (1 = highest)
}

export interface AssessmentJob {
  jobId: string;
  target: string;
  targetType: TargetType;
  status: JobStatus;
  progress: number; // 0 to 100%
  error?: string;
  options?: AssessmentJobOptions;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
