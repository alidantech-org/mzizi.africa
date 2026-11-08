
import type { CheckKind } from "#/types/website/check-kind.enum.ts";
import type { CheckOutcome } from "#/types/website/check-outcome.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { Site } from "#/types/website/site.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Site Check */
export interface SiteCheck {
  checkedAt: DateTime;
  createdAt: DateTime;
  detail?: LongText | null;
  id: Id;
  kind: CheckKind;
  outcome: CheckOutcome;
  siteId: Id;
  structureVersionId?: Id | null;
  updatedAt: DateTime;
  version: Version;
}