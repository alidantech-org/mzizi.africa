
import type { CodedIdentified } from './coded-identified';

/** Base for operational records with a unique identity code and creation time. */
export interface CodedCreated {
  code: string;
  createdAt: string;
  id: string;
}