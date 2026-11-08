
import type { Text } from "#/types/pipeline/text.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";

/** Document Summary */
export interface DocumentSummary {
  captures: PaginationNumber;
  id: Id;
  kind: Label;
  language?: Label | null;
  publishedOn?: Label | null;
  publisher: Text;
  title: Text;
  url?: Text | null;
}