import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { CountryContextDocumentLevels } from "#/modules/structure/schema/interface/country-context-document-levels.interface.ts";

/** Country Context Document */
export interface CountryContextDocument {
  code: IsoAlpha2 | null;
  countryId: Id;
  levels: CountryContextDocumentLevels[];
  name: Name;
}
