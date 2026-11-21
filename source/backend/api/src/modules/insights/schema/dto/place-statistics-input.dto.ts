import { IsOptional, IsString, Length, Matches, MaxLength, MinLength } from "class-validator";
import type { AddressLanguage } from "#/modules/insights/schema/type/address-language.type.ts";
import type { AddressPath } from "#/modules/insights/schema/type/address-path.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Place Statistics Input
 */
export class PlaceStatisticsInputDto {
  @IsString()
  @Length(2, 2)
  @Matches(new RegExp("^[A-Z]{2}$"))
  countryCode!: IsoAlpha2;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(35)
  languageCode?: AddressLanguage;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1500)
  path?: AddressPath;

  @IsOptional()
  @IsString()
  scope?: String;

  @IsOptional()
  @IsString()
  topic?: String;
}
