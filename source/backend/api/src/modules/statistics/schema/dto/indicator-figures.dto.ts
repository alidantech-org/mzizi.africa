import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * Indicator Figures
 */
export class IndicatorFiguresDto {
  @IsString()
  @IsUUID()
  countryId!: Id;

  @IsOptional()
  @IsInt()
  @Min(-10000)
  @Max(3000)
  fromYear?: Year;

  @IsString()
  @IsUUID()
  indicatorId!: Id;

  @IsOptional()
  @IsInt()
  limit?: Integer;

  @IsOptional()
  @IsInt()
  offset?: Integer;
}
