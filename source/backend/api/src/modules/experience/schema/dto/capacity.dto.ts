import { IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/**
 * Capacity
 */
export class CapacityDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  indicatorCode!: NonEmptyString255;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  label!: Name;

  @IsNumber({})
  value!: Number;
}
