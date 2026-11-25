import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { EraEntryDto } from "#/modules/history/schema/dto/era-entry.dto.ts";

/**
 * Era Collection
 */
export class EraCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => EraEntryDto)
  eras!: EraEntryDto[];
}
