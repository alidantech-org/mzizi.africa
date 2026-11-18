import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import type { Code } from "#/modules/experience/schema/type/code.type.ts";
import type { Language } from "#/modules/experience/schema/type/language.type.ts";

/**
 * Facility Key
 */
export class FacilityKeyDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  code!: Code;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(35)
  languageCode?: Language;
}
