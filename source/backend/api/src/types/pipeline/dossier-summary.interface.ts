
import type { Text } from "#/types/pipeline/text.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Dossier Summary */
export interface DossierSummary {
  id: Id;
  isCurrent: Flag;
  jurisdictionId: Id;
  jurisdictionName: Label;
  launchStage: Label;
  openQuestions?: Text | null;
  reviewedAt?: DateTime | null;
}