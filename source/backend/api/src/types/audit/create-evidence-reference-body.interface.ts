
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";

/** Create Evidence Reference Body */
export interface CreateEvidenceReferenceBody {
  fileId: Id;
  note?: Description | null;
  targetId: Id;
  targetKind: TargetKind;
}