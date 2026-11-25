import { IsBoolean, IsEnum, IsString, MaxLength, MinLength } from "class-validator";
import { TextDirection } from "#/modules/shared/schema/enum/text-direction.enum.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { LanguageCode } from "#/modules/shared/schema/type/language-code.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";

/**
 * Localized Text
 */
export class LocalizedTextDto {
  @IsEnum(TextDirection)
  direction!: TextDirection;

  @IsBoolean()
  isFallback!: Flag;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  language!: LanguageCode;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  text!: NonEmptyString1000;
}
