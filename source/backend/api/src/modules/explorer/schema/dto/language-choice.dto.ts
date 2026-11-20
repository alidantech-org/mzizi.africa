import { IsString, MaxLength, MinLength } from "class-validator";
import type { LanguageCode } from "#/modules/explorer/schema/type/language-code.type.ts";
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
}
