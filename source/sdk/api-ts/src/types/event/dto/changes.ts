/** A postponement, cancellation or move of an occurrence. */
export interface EventChanges {
  authorityId?: string | null;
  basisProvisionId?: string | null;
  createdAt: string;
  decidedOn?: string | null;
  deletedAt?: string | null;
  fromOn?: string | null;
  id: string;
  kindTerm: string;
  note?: string | null;
  noteLanguageId?: string | null;
  occurrenceId: string;
  reasonTerm?: string | null;
  replacementOccurrenceId?: string | null;
  toOn?: string | null;
  updatedAt: string;
  version: number;
}
