import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { OccurrenceEntryDto } from "#/modules/event/schema/dto/occurrence-entry.dto.ts";

/**
 * Occurrence Collection
 */
export class OccurrenceCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => OccurrenceEntryDto)
  occurrences!: OccurrenceEntryDto[];
}
