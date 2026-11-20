import { IsOptional, IsString, Length, Matches, MaxLength, MinLength } from "class-validator";
import type { CopyArea } from "#/modules/explorer/schema/type/copy-area.type.ts";
import type { LanguageCode } from "#/modules/explorer/schema/type/language-code.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";

/**
 * Copy Input
 */
export class CopyInputDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  area?: CopyArea;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  @Matches(new RegExp("^[A-Z]{2}$"))
  countryCode?: IsoAlpha2;

  @IsString()
  @MinLength(2)
  @MaxLength(35)
  languageCode!: LanguageCode;
}
