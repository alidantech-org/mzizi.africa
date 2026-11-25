import { Type } from "class-transformer";
import {
  IsArray,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { OfficeRowDto } from "#/modules/frontend/schema/dto/office-row.dto.ts";
import { LocalizedTextDto } from "#/modules/shared/schema/dto/localized-text.dto.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { LanguageCode } from "#/modules/shared/schema/type/language-code.type.ts";

/**
 * Institution Screen
 */
export class InstitutionScreenDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  arm?: LocalizedTextDto;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  language!: LanguageCode;

  @IsDefined()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  name!: LocalizedTextDto;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => OfficeRowDto)
  offices!: OfficeRowDto[];
}
