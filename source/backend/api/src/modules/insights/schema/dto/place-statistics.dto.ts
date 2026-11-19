import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { PlaceCrumbDto } from "#/modules/insights/schema/dto/place-crumb.dto.ts";
import { PlaceStatisticsBreakdownsDto } from "#/modules/insights/schema/dto/place-statistics-breakdowns.dto.ts";
import { PlaceStatisticsComparisonsDto } from "#/modules/insights/schema/dto/place-statistics-comparisons.dto.ts";
import { PlaceStatisticsSiblingsDto } from "#/modules/insights/schema/dto/place-statistics-siblings.dto.ts";
import { PlaceStatisticsTopicsDto } from "#/modules/insights/schema/dto/place-statistics-topics.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Place Statistics
 */
export class PlaceStatisticsDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => PlaceStatisticsBreakdownsDto)
  breakdowns!: PlaceStatisticsBreakdownsDto;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceCrumbDto)
  chain!: PlaceCrumbDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceStatisticsComparisonsDto)
  comparisons!: PlaceStatisticsComparisonsDto[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsDefined()
  @ValidateNested()
  @Type(() => PlaceCrumbDto)
  place!: PlaceCrumbDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => PlaceStatisticsSiblingsDto)
  siblings!: PlaceStatisticsSiblingsDto;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceStatisticsTopicsDto)
  topics!: PlaceStatisticsTopicsDto[];
}
