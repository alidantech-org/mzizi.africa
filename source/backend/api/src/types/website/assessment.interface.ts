
import type { AccessBasis } from "#/types/website/access-basis.enum.ts";
import type { AssessmentSourceType } from "#/types/website/assessment-source-type.enum.ts";
import type { LegalReviewStatus } from "#/types/website/legal-review-status.enum.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { JsonText } from "#/types/website/json-text.type.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { Site } from "#/types/website/site.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Assessment */
export interface Assessment {
  accessBasis: AccessBasis;
  accessConditions?: LongText | null;
  approvedScope: JsonText;
  conditions?: JsonText | null;
  createdAt: DateTime;
  evidence?: JsonText | null;
  id: Id;
  isCurrent: Flag;
  jurisdictionId?: Id | null;
  lawfulBasis?: Description | null;
  licenceName?: Name | null;
  licenceUrl?: Url | null;
  licenceVersion?: Label | null;
  personalDataCategories: JsonText;
  processingPurpose?: Description | null;
  rationale?: LongText | null;
  reviewDueAt?: DateTime | null;
  reviewedAt?: DateTime | null;
  reviewedBy?: Id | null;
  rightsHolder: Name;
  siteId: Id;
  sourceType: AssessmentSourceType;
  status: LegalReviewStatus;
  supersedesId?: Id | null;
  updatedAt: DateTime;
  version: Version;
}