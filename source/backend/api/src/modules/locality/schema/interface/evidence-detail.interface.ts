import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { EvidenceRef } from "#/modules/locality/schema/interface/evidence-ref.interface.ts";
import type { MediaRef } from "#/modules/locality/schema/interface/media-ref.interface.ts";

/** Evidence Detail */
export interface EvidenceDetail {
  editionLabel?: Name | null;
  evidence: EvidenceRef;
  files: MediaRef[];
  quotedText?: Description | null;
  sourceCode?: IdentityCode | null;
  sourceId?: Id | null;
}
