
import type { Created } from './created';

/** Base for operational records: identity, creation time and last-change time. */
export interface Timestamped {
  createdAt: string;
  id: string;
  updatedAt: string;
}