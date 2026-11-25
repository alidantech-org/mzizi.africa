import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { AppropriationEntryDto } from "#/modules/finance/schema/dto/appropriation-entry.dto.ts";

/**
 * Appropriation Collection
 */
export class AppropriationCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => AppropriationEntryDto)
  appropriations!: AppropriationEntryDto[];
}
