
import { JobStatus } from './enums/job-status';

/** Job */
export interface Job {
  attempts: number;
  error?: string;
  id: string;
  kind: string;
  result?: unknown;
  runId?: string;
  status: JobStatus;
}