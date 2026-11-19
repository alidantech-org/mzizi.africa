import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Compare Options Hierarchy Unit */
export interface CompareOptionsHierarchyUnit {
  featureId: String;
  kindCode: String;
  kindLabel: String;
  name: String;
  path?: String;
}
