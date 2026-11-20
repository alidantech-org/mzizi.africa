import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import type { LanguageCode } from "#/modules/explorer/schema/type/language-code.type.ts";

/**
 * Bootstrap Input
 */
export class BootstrapInputDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(35)
  languageCode?: LanguageCode;
}
