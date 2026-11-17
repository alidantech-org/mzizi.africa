
import { JobStatus } from './enums/job-status';

/** List Jobs Input */
export interface ListJobsInput {
  limit?: number;
  status?: JobStatus;
}