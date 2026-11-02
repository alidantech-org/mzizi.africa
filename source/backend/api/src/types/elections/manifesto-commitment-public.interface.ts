
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Count } from "#/types/shared/count.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Manifesto } from "#/types/elections/manifesto.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Manifesto Commitment Public */
export interface ManifestoCommitmentPublic {
  createdAt: DateTime;
  id: Id;
  isCurrent: Flag;
  manifestoId: Id;
  parentId?: Id | null;
  sortOrder: Count;
  text: LongText;
  topicId?: Id | null;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}