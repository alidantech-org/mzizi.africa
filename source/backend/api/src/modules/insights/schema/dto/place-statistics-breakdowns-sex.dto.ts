import { IsNumber, IsString } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Place Statistics Breakdowns Sex
 */
export class PlaceStatisticsBreakdownsSexDto {
  @IsString()
  label!: String;

  @IsNumber({})
  share!: Number;

  @IsNumber({})
  value!: Number;
}
