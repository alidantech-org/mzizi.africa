
import {
  IsBoolean,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Flag } from "#/modules/shared/flag.type.ts";
import type { LanguageTag } from "#/modules/shared/language-tag.type.ts";
import type { Name } from "#/modules/shared/name.type.ts";

/**
 * Institution Entry Names
 */
export class InstitutionEntryNamesDto {

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