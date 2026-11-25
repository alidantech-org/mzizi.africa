import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { LanguageEntryDto } from "#/modules/reference/schema/dto/language-entry.dto.ts";

/**
 * Language Collection
 */
export class LanguageCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => LanguageEntryDto)
  languages!: LanguageEntryDto[];
}
