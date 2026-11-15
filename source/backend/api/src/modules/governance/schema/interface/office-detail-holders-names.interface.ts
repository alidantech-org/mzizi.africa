import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/** Office Detail Holders Names */
export interface OfficeDetailHoldersNames {
  isPreferred: Flag;
  name: Name;
}
