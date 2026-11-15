
import {
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { LanguageTag } from "#/modules/shared/type/language-tag.type.ts";
import type { Name } from "#/modules/shared/type/name.type.ts";

/**
 * Unit Detail Names
 */
export class UnitDetailNamesDto {

  @ValidateIf((object) => object.languageTag !== null)
  @IsString()
  @MinLength(2)
  @MaxLength(35)
  languageTag!: LanguageTag | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;
}