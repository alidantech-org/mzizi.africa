import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import type { Code } from "#/modules/experience/schema/type/code.type.ts";
import type { Language } from "#/modules/experience/schema/type/language.type.ts";

/**
 * Copy Input
 */
export class CopyInputDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  countryCode?: Code;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(35)
  languageCode?: Language;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  prefix?: Code;
}
