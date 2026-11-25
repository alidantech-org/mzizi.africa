import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { CountryEntryNamesDto } from "#/modules/reference/schema/dto/country-entry-names.dto.ts";
import type { CallingCode } from "#/modules/reference/schema/type/calling-code.type.ts";
import type { CurrencyCode } from "#/modules/reference/schema/type/currency-code.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { IsoAlpha3 } from "#/modules/reference/schema/type/iso-alpha3.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/**
 * Country Entry
 */
export class CountryEntryDto {
  @ValidateIf((object) => object.callingCode !== null)
  @IsString()
  @MinLength(2)
  @MaxLength(5)
  @Matches(new RegExp("^\\+[0-9]{1,4}$"))
  callingCode!: CallingCode | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsString()
  @IsUUID()
  countryId!: Id;

  @ValidateIf((object) => object.currencyCode !== null)
  @IsString()
  @Length(3, 3)
  @Matches(new RegExp("^[A-Z]{3}$"))
  currencyCode!: CurrencyCode | null;

  @ValidateIf((object) => object.isoAlpha2 !== null)
  @IsString()
  @Length(2, 2)
  @Matches(new RegExp("^[A-Z]{2}$"))
  isoAlpha2!: IsoAlpha2 | null;

  @ValidateIf((object) => object.isoAlpha3 !== null)
  @IsString()
  @Length(3, 3)
  @Matches(new RegExp("^[A-Z]{3}$"))
  isoAlpha3!: IsoAlpha3 | null;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CountryEntryNamesDto)
  names!: CountryEntryNamesDto[];
}
