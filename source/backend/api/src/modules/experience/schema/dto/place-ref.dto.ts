import { IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";

/**
 * Place Ref
 */
export class PlaceRefDto {
  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  kindCode!: NonEmptyString100;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  kindLabel!: Name;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  path!: NonEmptyString1000;
}
