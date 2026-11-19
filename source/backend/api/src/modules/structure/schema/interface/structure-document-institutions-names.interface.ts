import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/** Structure Document Institutions Names */
export interface StructureDocumentInstitutionsNames {
  name: Name;
  preferred: Flag;
}
