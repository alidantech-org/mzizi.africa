
import type { Text } from "#/types/pipeline/text.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";

/** Promote Response */
export interface PromoteResponse {
  outcome: Label;
  reason?: Text | null;
  recordId?: Id | null;
}