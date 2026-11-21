import {
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import type { AddressLanguage } from "#/modules/insights/schema/type/address-language.type.ts";
import type { AddressPath } from "#/modules/insights/schema/type/address-path.type.ts";
import type { Limit } from "#/modules/insights/schema/type/limit.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/**
 * Tenders At Input
 */
export class TendersAtInputDto {
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
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: Limit;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1500)
  path?: AddressPath;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  status?: NonEmptyString100;
}
