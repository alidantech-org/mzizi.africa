import { IsBoolean, IsInt, IsString, MaxLength, Min, MinLength } from "class-validator";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/**
 * Context Level
 */
export class ContextLevelDto {
  @IsInt()
  @Min(0)
  depth!: NonNegativeInteger;

  @IsBoolean()
  isRouting!: Flag;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  kindCode!: NonEmptyString100;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  kindLabel!: Name;
}
