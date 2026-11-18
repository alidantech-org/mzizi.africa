import type { Code } from "#/modules/experience/schema/type/code.type.ts";
import type { Language } from "#/modules/experience/schema/type/language.type.ts";
import type { Path } from "#/modules/experience/schema/type/path.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/** Context Input */
export interface ContextInput {
  countryCode?: Code;
  edgeCountry?: Code;
  featureId?: Id;
  languageCode?: Language;
  path?: Path;
}
