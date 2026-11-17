
import type { Identified } from './identified';

/** Base for operational records with a unique identity code. */
export interface CodedIdentified {
  code: string;
  id: string;
}