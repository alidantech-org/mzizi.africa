import { IsNumber, IsString } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Place Civic Years Classes
 */
export class PlaceCivicYearsClassesDto {
  @IsNumber({})
  amount!: Number;

  @IsString()
  code!: String;

  @IsString()
  label!: String;

  @IsNumber({})
  lines!: Number;
}
