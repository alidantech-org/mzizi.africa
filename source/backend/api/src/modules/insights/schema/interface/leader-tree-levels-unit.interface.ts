import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Leader Tree Levels Unit */
export interface LeaderTreeLevelsUnit {
  featureId: String;
  kindCode: String;
  kindLabel: String;
  name: String;
  path?: String;
}
