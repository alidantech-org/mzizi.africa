
import {
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { LanguageTag } from "#/modules/shared/schema/type/language-tag.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/**
 * Unit Entry Names
 */
export class UnitEntryNamesDto {

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