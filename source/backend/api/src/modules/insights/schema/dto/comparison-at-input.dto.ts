import { IsOptional, IsString, Length, Matches, MaxLength, MinLength } from "class-validator";
import type { AddressLanguage } from "#/modules/insights/schema/type/address-language.type.ts";
import type { AddressPath } from "#/modules/insights/schema/type/address-path.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";

/**
 * Comparison At Input
 */
export class ComparisonAtInputDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1500)
  a!: AddressPath;

  @IsString()
  @MinLength(1)
  @MaxLength(1500)
  b!: AddressPath;

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
  @MaxLength(1000)
  metrics?: NonEmptyString1000;
}
