import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { TallyEntryDto } from "#/modules/election/schema/dto/tally-entry.dto.ts";

/**
 * Tally Collection
 */
export class TallyCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => TallyEntryDto)
  tallies!: TallyEntryDto[];
}
