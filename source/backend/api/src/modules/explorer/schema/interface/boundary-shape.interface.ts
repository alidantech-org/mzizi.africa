import type { Amount } from "#/modules/explorer/schema/type/amount.type.ts";
import type { Degrees } from "#/modules/explorer/schema/type/degrees.type.ts";
import type { Path } from "#/modules/explorer/schema/type/path.type.ts";
import type { JsonText } from "#/modules/shared/schema/type/json-text.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/** Boundary Shape */
export interface BoundaryShape {
  address: Path;
  bbox: Degrees[];
  childCount: NonNegativeInteger;
  geometry: JsonText;
  kind: Name;
  kindCode: NonEmptyString255;
  name: Name;
  population?: Amount | null;
}
