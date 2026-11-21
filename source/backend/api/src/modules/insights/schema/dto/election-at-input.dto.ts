import {
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import type { AddressLanguage } from "#/modules/insights/schema/type/address-language.type.ts";
import type { AddressPath } from "#/modules/insights/schema/type/address-path.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/**
 * Election At Input
 */
export class ElectionAtInputDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  contestKind?: NonEmptyString100;

  @IsString()
  @Length(2, 2)
  @Matches(new RegExp("^[A-Z]{2}$"))
  countryCode!: IsoAlpha2;

  @IsString()
  @IsUUID()
  electionId!: Id;

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
}
