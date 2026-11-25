import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { CountryLinkDto } from "#/modules/frontend/schema/dto/country-link.dto.ts";
import { LanguageOptionDto } from "#/modules/frontend/schema/dto/language-option.dto.ts";
import type { LanguageCode } from "#/modules/shared/schema/type/language-code.type.ts";

/**
 * Home Screen
 */
export class HomeScreenDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CountryLinkDto)
  countries!: CountryLinkDto[];

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  language!: LanguageCode;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => LanguageOptionDto)
  languages!: LanguageOptionDto[];
}
