import type { Code } from "#/modules/experience/schema/type/code.type.ts";
import type { Language } from "#/modules/experience/schema/type/language.type.ts";
import type { Limit } from "#/modules/experience/schema/type/limit.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/** Facilities Input */
export interface FacilitiesInput {
  classCode?: Code;
  featureId?: Id;
  languageCode?: Language;
  limit?: Limit;
  query?: Code;
}
