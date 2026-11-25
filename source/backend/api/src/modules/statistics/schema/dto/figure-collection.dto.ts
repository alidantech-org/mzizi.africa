import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { FigureEntryDto } from "#/modules/statistics/schema/dto/figure-entry.dto.ts";

/**
 * Figure Collection
 */
export class FigureCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => FigureEntryDto)
  figures!: FigureEntryDto[];
}
