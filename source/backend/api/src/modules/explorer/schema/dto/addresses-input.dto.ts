import { IsArray, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import type { LanguageCode } from "#/modules/explorer/schema/type/language-code.type.ts";
import type { Path } from "#/modules/explorer/schema/type/path.type.ts";

/**
 * Addresses Input
 */
export class AddressesInputDto {
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(1500, { each: true })
  addresses!: Path[];

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(35)
  languageCode?: LanguageCode;
}
