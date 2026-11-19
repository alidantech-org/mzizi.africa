import { IsBoolean, IsNumber, IsString } from "class-validator";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Place Statistics Topics Indicators Previous
 */
export class PlaceStatisticsTopicsIndicatorsPreviousDto {
  @IsBoolean()
  estimated!: Flag;

  @IsString()
  period!: String;

  @IsNumber({})
  value!: Number;
}
