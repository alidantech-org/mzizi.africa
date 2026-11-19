import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Leader Profile Activity Speeches */
export interface LeaderProfileActivitySpeeches {
  heldOn: String;
  kind: String;
  motion: String;
  motionCode: String;
  summary: String;
  wordCount: Number;
}
