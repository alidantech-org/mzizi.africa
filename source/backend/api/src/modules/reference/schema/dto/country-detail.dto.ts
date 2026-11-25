import { Type } from "class-transformer";
import {
  IsArray,
  IsISO8601,
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
import { CountryDetailLocalesDto } from "#/modules/reference/schema/dto/country-detail-locales.dto.ts";
import { CountryDetailNamesDto } from "#/modules/reference/schema/dto/country-detail-names.dto.ts";
import type { CallingCode } from "#/modules/reference/schema/type/calling-code.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { IsoAlpha3 } from "#/modules/reference/schema/type/iso-alpha3.type.ts";
import type { IsoNumeric } from "#/modules/reference/schema/type/iso-numeric.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Country Detail
 */
export class CountryDetailDto {
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

  @ValidateIf((object) => object.currencyId !== null)
  @IsString()
  @IsUUID()
  currencyId!: Id | null;

  @ValidateIf((object) => object.designationTerm !== null)
  @IsString()
  @IsUUID()
  designationTerm!: Id | null;

  @ValidateIf((object) => object.establishedOn !== null)
  @IsISO8601({ strict: true })
  establishedOn!: CalendarDate | null;

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

  @ValidateIf((object) => object.isoNumeric !== null)
  @IsString()
  @Length(3, 3)
  @Matches(new RegExp("^[0-9]{3}$"))
  isoNumeric!: IsoNumeric | null;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CountryDetailLocalesDto)
  locales!: CountryDetailLocalesDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CountryDetailNamesDto)
  names!: CountryDetailNamesDto[];

  @ValidateIf((object) => object.recognitionTerm !== null)
  @IsString()
  @IsUUID()
  recognitionTerm!: Id | null;
}
