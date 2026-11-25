import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { ObservationEntryDto } from "#/modules/statistics/schema/dto/observation-entry.dto.ts";

/**
 * Observation Collection
 */
export class ObservationCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ObservationEntryDto)
  observations!: ObservationEntryDto[];
}
