import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/** Place Crumb */
export interface PlaceCrumb {
  featureId: Id;
  kindCode: IdentityCode;
  kindLabel: Name;
  name: Name;
}
