import { IsBoolean, IsString, MaxLength, MinLength } from "class-validator";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";

/**
 * Navigation Item
 */
export class NavigationItemDto {
  @IsBoolean()
  available!: Flag;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  view!: NonEmptyString255;
}
