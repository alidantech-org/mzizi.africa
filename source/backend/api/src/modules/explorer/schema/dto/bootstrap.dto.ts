import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { CopyEntryDto } from "#/modules/explorer/schema/dto/copy-entry.dto.ts";
import { CountryChoiceDto } from "#/modules/explorer/schema/dto/country-choice.dto.ts";
import { LanguageChoiceDto } from "#/modules/explorer/schema/dto/language-choice.dto.ts";
import type { LanguageCode } from "#/modules/explorer/schema/type/language-code.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Bootstrap
 */
export class BootstrapDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CopyEntryDto)
  copy!: CopyEntryDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CountryChoiceDto)
  countries!: CountryChoiceDto[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsString()
  @MinLength(2)
  @MaxLength(35)
  language!: LanguageCode;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => LanguageChoiceDto)
  languages!: LanguageChoiceDto[];
}
