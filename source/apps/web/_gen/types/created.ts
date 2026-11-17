
import type { Identified } from './identified';

/** Base for operational records: identity and creation time. */
export interface Created {
  createdAt: string;
  id: string;
}