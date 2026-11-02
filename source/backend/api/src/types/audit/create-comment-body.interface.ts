
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";

/** Create Comment Body */
export interface CreateCommentBody {
  body: LongText;
  parentCommentId?: Id | null;
  targetId: Id;
  targetKind: TargetKind;
}