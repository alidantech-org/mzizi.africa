import { IsInt, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import type { LanguageCode } from "#/modules/locality/schema/type/language-code.type.ts";
import type { SearchText } from "#/modules/locality/schema/type/search-text.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/**
 * Search Input
 */
export class SearchInputDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(35)
  languageCode?: LanguageCode;

  @IsOptional()
  @IsInt()
  limit?: Integer;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  query!: SearchText;
}
