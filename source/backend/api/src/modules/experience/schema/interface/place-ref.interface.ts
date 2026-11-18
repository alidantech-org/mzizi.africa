import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";

/** Place Ref */
export interface PlaceRef {
  featureId: Id;
  kindCode: NonEmptyString100;
  kindLabel: Name;
  name: Name;
  path: NonEmptyString1000;
}
