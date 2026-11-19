import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/** Structure Document Institutions Powers */
export interface StructureDocumentInstitutionsPowers {
  binding: Flag;
  citationId: Id | null;
  code: IdentityCode;
  id: Id;
  kind: Name;
  procedureId: Id | null;
  step: PositiveInteger | null;
  targetInstitutionId: Id | null;
  targetPositionId: Id | null;
}
