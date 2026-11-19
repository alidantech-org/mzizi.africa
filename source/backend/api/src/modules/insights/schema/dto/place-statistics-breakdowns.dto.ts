import { Type } from "class-transformer";
import { IsArray, IsOptional, ValidateNested } from "class-validator";
import { PlaceStatisticsBreakdownsAgeDto } from "#/modules/insights/schema/dto/place-statistics-breakdowns-age.dto.ts";
import { PlaceStatisticsBreakdownsCommunityDto } from "#/modules/insights/schema/dto/place-statistics-breakdowns-community.dto.ts";
import { PlaceStatisticsBreakdownsLanguageDto } from "#/modules/insights/schema/dto/place-statistics-breakdowns-language.dto.ts";
import { PlaceStatisticsBreakdownsResidenceDto } from "#/modules/insights/schema/dto/place-statistics-breakdowns-residence.dto.ts";
import { PlaceStatisticsBreakdownsSexDto } from "#/modules/insights/schema/dto/place-statistics-breakdowns-sex.dto.ts";

/**
 * Place Statistics Breakdowns
 */
export class PlaceStatisticsBreakdownsDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlaceStatisticsBreakdownsAgeDto)
  age?: PlaceStatisticsBreakdownsAgeDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlaceStatisticsBreakdownsCommunityDto)
  community?: PlaceStatisticsBreakdownsCommunityDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlaceStatisticsBreakdownsLanguageDto)
  language?: PlaceStatisticsBreakdownsLanguageDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlaceStatisticsBreakdownsResidenceDto)
  residence?: PlaceStatisticsBreakdownsResidenceDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlaceStatisticsBreakdownsSexDto)
  sex?: PlaceStatisticsBreakdownsSexDto[];
}
