import { IsNumber } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/**
 * Place Statistics Siblings Density
 */
export class PlaceStatisticsSiblingsDensityDto {
  @IsNumber({})
  of!: Number;

  @IsNumber({})
  position!: Number;
}
