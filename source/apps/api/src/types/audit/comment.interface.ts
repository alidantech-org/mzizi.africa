
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Comment */
export interface Comment {
  actorId: Id;
  body: LongText;
  createdAt: DateTime;
  id: Id;
  parentCommentId?: Id | null;
  targetId: Id;
  targetKind: TargetKind;
  updatedAt: DateTime;
  version: Version;
}