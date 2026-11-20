import { IsInt, IsString, MaxLength, Min, MinLength } from "class-validator";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/**
 * Level
 */
export class LevelDto {
  @IsInt()
  @Min(0)
  depth!: NonNegativeInteger;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  kindCode!: NonEmptyString255;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  label!: Name;
}
