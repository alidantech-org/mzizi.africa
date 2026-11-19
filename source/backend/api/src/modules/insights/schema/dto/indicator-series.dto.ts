import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { IndicatorSeriesIndicatorDto } from "#/modules/insights/schema/dto/indicator-series-indicator.dto.ts";
import { IndicatorSeriesPointsDto } from "#/modules/insights/schema/dto/indicator-series-points.dto.ts";
import { PlaceCrumbDto } from "#/modules/insights/schema/dto/place-crumb.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Indicator Series
 */
export class IndicatorSeriesDto {
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsDefined()
  @ValidateNested()
  @Type(() => IndicatorSeriesIndicatorDto)
  indicator!: IndicatorSeriesIndicatorDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => PlaceCrumbDto)
  place!: PlaceCrumbDto;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => IndicatorSeriesPointsDto)
  points!: IndicatorSeriesPointsDto[];
}
