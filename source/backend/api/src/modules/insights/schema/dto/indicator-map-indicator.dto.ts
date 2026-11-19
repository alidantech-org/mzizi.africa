import { IsBoolean, IsOptional, IsString, ValidateIf } from "class-validator";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Indicator Map Indicator
 */
export class IndicatorMapIndicatorDto {
  @IsString()
  code!: String;

  @IsOptional()
  @ValidateIf((object) => object.higherIsBetter !== null)
  @IsBoolean()
  higherIsBetter?: Flag | null;

  @IsString()
  name!: String;

  @IsString()
  unit!: String;
}
