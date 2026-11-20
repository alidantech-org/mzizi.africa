import { IsInt, IsString, MaxLength, Min, MinLength } from "class-validator";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/**
 * Count
 */
export class CountDto {
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  label!: Name;

  @IsInt()
  @Min(0)
  value!: NonNegativeInteger;
}
