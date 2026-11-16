import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import type { CallingCode } from "#/modules/reference/schema/type/calling-code.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { IsoAlpha3 } from "#/modules/reference/schema/type/iso-alpha3.type.ts";
import type { IsoNumeric } from "#/modules/reference/schema/type/iso-numeric.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Canonical identity for a modern country; not a geographic unit or historical polity. (entity)
 */
export class CountryDto {
  @IsOptional()
  @ValidateIf((object) => object.callingCode !== null)
  @IsString()
  @MinLength(2)
  @MaxLength(5)
  @Matches(new RegExp("^\\+[0-9]{1,4}$"))
  callingCode?: CallingCode | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(new RegExp("^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"))
  code!: IdentityCode;

  @IsOptional()
  @ValidateIf((object) => object.continentId !== null)
  @IsString()
  @IsUUID()
  continentId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.currencyId !== null)
  @IsString()
  @IsUUID()
  currencyId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.designationId !== null)
  @IsString()
  @IsUUID()
  designationId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.establishedOn !== null)
  @IsISO8601({ strict: true })
  establishedOn?: CalendarDate | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.isoAlpha2 !== null)
  @IsString()
  @Length(2, 2)
  @Matches(new RegExp("^[A-Z]{2}$"))
  isoAlpha2?: IsoAlpha2 | null;

  @IsOptional()
  @ValidateIf((object) => object.isoAlpha3 !== null)
  @IsString()
  @Length(3, 3)
  @Matches(new RegExp("^[A-Z]{3}$"))
  isoAlpha3?: IsoAlpha3 | null;

  @IsOptional()
  @ValidateIf((object) => object.isoNumeric !== null)
  @IsString()
  @Length(3, 3)
  @Matches(new RegExp("^[0-9]{3}$"))
  isoNumeric?: IsoNumeric | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsOptional()
  @ValidateIf((object) => object.officialName !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  officialName?: Name | null;

  @IsOptional()
  @ValidateIf((object) => object.recognitionStatusId !== null)
  @IsString()
  @IsUUID()
  recognitionStatusId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.subregionId !== null)
  @IsString()
  @IsUUID()
  subregionId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
