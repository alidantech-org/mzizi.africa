import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/** Structure Document Procedures */
export interface StructureDocumentProcedures {
  citationId: Id | null;
  code: IdentityCode;
  description: Description;
  id: Id;
  kind: Name;
}
