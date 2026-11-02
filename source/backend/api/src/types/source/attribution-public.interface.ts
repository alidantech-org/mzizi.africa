
import type { AttributionRelation } from "#/types/source/attribution-relation.enum.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Locator } from "#/types/source/locator.type.ts";
import type { Document } from "#/types/source/document.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Attribution Public */
export interface AttributionPublic {
  attributedBy?: Id | null;
  captureId?: Id | null;
  confidence?: Confidence | null;
  createdAt: DateTime;
  documentId: Id;
  id: Id;
  locator?: Locator | null;
  methodId: Id;
  relation: AttributionRelation;
  targetField?: Label | null;
  targetId: Id;
  targetKind: TargetKind;
  updatedAt: DateTime;
  version: Version;
}