/** One edge of a boundary change: splits, merges, creation or dissolution, without overwriting the places. */
export interface GeographyChanges {
  createdAt: string;
  deletedAt?: string | null;
  effectiveOn?: string | null;
  id: string;
  kindTerm: string;
  note?: string | null;
  noteLanguageId?: string | null;
  occurrenceId?: string | null;
  predecessorFeatureId?: string | null;
  successorFeatureId?: string | null;
  updatedAt: string;
  version: number;
}
