import type { Code } from "#/modules/insights/schema/type/code.type.ts";
import type { Text } from "#/modules/insights/schema/type/text.type.ts";

/** Institutions Input */
export interface InstitutionsInput {
  armCode?: Code;
  kindCode?: Code;
  query?: Text;
}
