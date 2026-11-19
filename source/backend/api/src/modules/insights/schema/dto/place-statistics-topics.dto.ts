import { Type } from "class-transformer";
import { IsArray, IsString, IsDefined, ValidateNested } from "class-validator";
import { PlaceStatisticsTopicsIndicatorsDto } from "#/modules/insights/schema/dto/place-statistics-topics-indicators.dto.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Place Statistics Topics
 */
export class PlaceStatisticsTopicsDto {
  @IsString()
  code!: String;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceStatisticsTopicsIndicatorsDto)
  indicators!: PlaceStatisticsTopicsIndicatorsDto[];

  @IsString()
  label!: String;
}
