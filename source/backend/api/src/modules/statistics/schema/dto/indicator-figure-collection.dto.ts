import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { IndicatorFigureEntryDto } from "#/modules/statistics/schema/dto/indicator-figure-entry.dto.ts";

/**
 * Indicator Figure Collection
 */
export class IndicatorFigureCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => IndicatorFigureEntryDto)
  figures!: IndicatorFigureEntryDto[];
}
