import { Type } from "class-transformer";
import {
  IsEnum,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { LocalizedTextDto } from "#/modules/shared/schema/dto/localized-text.dto.ts";
import { TextDirection } from "#/modules/shared/schema/enum/text-direction.enum.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { LanguageCode } from "#/modules/shared/schema/type/language-code.type.ts";

/**
 * Language Option
 */
export class LanguageOptionDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsEnum(TextDirection)
  direction!: TextDirection;

  @IsDefined()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  name!: LocalizedTextDto;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  tag!: LanguageCode;
}
