import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { IndicatorEntryDto } from "#/modules/statistics/schema/dto/indicator-entry.dto.ts";

/**
 * Indicator Collection
 */
export class IndicatorCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => IndicatorEntryDto)
  indicators!: IndicatorEntryDto[];
}
