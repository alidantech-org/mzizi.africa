import { Allow, IsBoolean, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Indicator Map Units
 */
export class IndicatorMapUnitsDto {
  @IsBoolean()
  estimated!: Flag;

  @IsString()
  featureId!: String;

  @IsOptional()
  @ValidateIf((object) => object.geometry !== null)
  @Allow()
  geometry?: unknown | null;

  @IsString()
  kind!: String;

  @IsString()
  name!: String;

  @IsString()
  path!: String;

  @IsNumber({})
  rank!: Number;

  @IsNumber({})
  value!: Number;
}
