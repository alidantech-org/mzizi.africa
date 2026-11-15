
import {
  IsBoolean,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Flag } from "#/modules/shared/type/flag.type.ts";
import type { LanguageTag } from "#/modules/shared/type/language-tag.type.ts";
import type { Name } from "#/modules/shared/type/name.type.ts";

/**
 * Institution Detail Names
 */
export class InstitutionDetailNamesDto {

  @IsBoolean()
  isPreferred!: Flag;

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