import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { LanguageChoiceDto } from "#/modules/locality/schema/dto/language-choice.dto.ts";

/**
 * Language List
 */
export class LanguageListDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => LanguageChoiceDto)
  languages!: LanguageChoiceDto[];
}
