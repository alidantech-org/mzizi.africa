import type { EvidenceMethod } from "#/modules/source/schema/enum/evidence-method.enum.ts";
import type { EvidenceRole } from "#/modules/source/schema/enum/evidence-role.enum.ts";
import type { Confidence } from "#/modules/shared/schema/type/confidence.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { Locator } from "#/modules/source/schema/type/locator.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/** Evidence Entry */
export interface EvidenceEntry {
  artifactId: Id | null;
  confidence: Confidence | null;
  editionDesignation: NonEmptyString255 | null;
  evidenceId: Id;
  locator: Locator;
  locatorTerm: Id;
  method: EvidenceMethod;
  observedAt: Instant | null;
  productCode: IdentityCode | null;
  publisherCode: IdentityCode | null;
  role: EvidenceRole;
}
