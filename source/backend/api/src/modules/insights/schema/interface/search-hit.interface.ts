import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/** Search Hit */
export interface SearchHit {
  code?: Name | null;
  featureId?: Id | null;
  id: Id;
  imageUrl?: NonEmptyString1000 | null;
  kind: NonEmptyString100;
  kindLabel: NonEmptyString100;
  path: Name[];
  subtitle?: NonEmptyString500 | null;
  title: Name;
}
