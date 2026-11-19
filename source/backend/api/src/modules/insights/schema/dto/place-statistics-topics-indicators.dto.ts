import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { PlaceStatisticsTopicsIndicatorsLatestDto } from "#/modules/insights/schema/dto/place-statistics-topics-indicators-latest.dto.ts";
import { PlaceStatisticsTopicsIndicatorsPreviousDto } from "#/modules/insights/schema/dto/place-statistics-topics-indicators-previous.dto.ts";
import { PlaceStatisticsTopicsIndicatorsSeriesDto } from "#/modules/insights/schema/dto/place-statistics-topics-indicators-series.dto.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Place Statistics Topics Indicators
 */
export class PlaceStatisticsTopicsIndicatorsDto {
  @IsOptional()
  @ValidateIf((object) => object.change !== null)
  @IsNumber({})
  change?: Number | null;

  @IsString()
  code!: String;

  @IsOptional()
  @ValidateIf((object) => object.higherIsBetter !== null)
  @IsBoolean()
  higherIsBetter?: Flag | null;

  @IsDefined()
  @ValidateNested()
  @Type(() => PlaceStatisticsTopicsIndicatorsLatestDto)
  latest!: PlaceStatisticsTopicsIndicatorsLatestDto;

  @IsString()
  measure!: String;

  @IsString()
  name!: String;

  @IsOptional()
  @ValidateIf((object) => object.previous !== null)
  @ValidateNested()
  @Type(() => PlaceStatisticsTopicsIndicatorsPreviousDto)
  previous?: PlaceStatisticsTopicsIndicatorsPreviousDto | null;

  @IsOptional()
  @ValidateIf((object) => object.role !== null)
  @IsString()
  role?: String | null;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceStatisticsTopicsIndicatorsSeriesDto)
  series!: PlaceStatisticsTopicsIndicatorsSeriesDto[];

  @IsString()
  unit!: String;
}
