import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Motion Detail Motion Contributions */
export interface MotionDetailMotionContributions {
  holderId: String;
  kind: String;
  name: String;
  party?: String | null;
  summary: String;
  wordCount: Number;
}
