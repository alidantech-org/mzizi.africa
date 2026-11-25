import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { HistoryEntryDto } from "#/modules/history/schema/dto/history-entry.dto.ts";

/**
 * History Collection
 */
export class HistoryCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => HistoryEntryDto)
  occurrences!: HistoryEntryDto[];
}
