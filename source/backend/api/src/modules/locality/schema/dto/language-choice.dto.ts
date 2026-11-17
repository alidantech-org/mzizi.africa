import { IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";
import type { LanguageCode } from "#/modules/locality/schema/type/language-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/**
 * Language Choice
 */
export class LanguageChoiceDto {
  @IsString()
  @MinLength(2)
  @MaxLength(35)
  code!: LanguageCode;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsOptional()
  @ValidateIf((object) => object.nativeName !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  nativeName?: Name | null;
}
