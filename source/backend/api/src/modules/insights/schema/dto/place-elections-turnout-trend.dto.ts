import { IsNumber } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/**
 * Place Elections Turnout Trend
 */
export class PlaceElectionsTurnoutTrendDto {
  @IsNumber({})
  registered!: Number;

  @IsNumber({})
  turnout!: Number;

  @IsNumber({})
  year!: Number;
}
