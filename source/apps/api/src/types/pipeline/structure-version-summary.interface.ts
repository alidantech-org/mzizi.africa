
import type { Text } from "#/types/pipeline/text.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Structure Version Summary */
export interface StructureVersionSummary {
  createdAt: DateTime;
  id: Id;
  isCurrent: Flag;
  notes?: Text | null;
  number: PaginationNumber;
  purpose: Label;
  schemaVersion: Label;
  status: Label;
  structureId: Id;
}