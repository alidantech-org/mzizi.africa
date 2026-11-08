
import type { LaunchStage } from "#/types/website/launch-stage.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { JsonText } from "#/types/website/json-text.type.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Dossier */
export interface Dossier {
  applicableLaws: JsonText;
  createdAt: DateTime;
  id: Id;
  isCurrent: Flag;
  jurisdictionId: Id;
  launchStage: LaunchStage;
  legislationRepositoryUrl?: Url | null;
  openQuestions?: LongText | null;
  regulator?: Name | null;
  reviewDueAt?: DateTime | null;
  reviewedAt?: DateTime | null;
  reviewerId?: Id | null;
  supersedesId?: Id | null;
  treatyStatus?: JsonText | null;
  updatedAt: DateTime;
  version: Version;
}