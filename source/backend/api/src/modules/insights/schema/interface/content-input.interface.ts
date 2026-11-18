import type { Code } from "#/modules/insights/schema/type/code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";

/** Content Input */
export interface ContentInput {
  languageCode?: NonEmptyString100;
  slug?: NonEmptyString255;
  subjectCode?: Code;
  subjectTable?: NonEmptyString100;
}
