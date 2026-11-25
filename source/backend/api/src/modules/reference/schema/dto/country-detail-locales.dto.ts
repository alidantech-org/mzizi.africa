import {
  IsInt,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Iso6391 } from "#/modules/reference/schema/type/iso6391.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * Country Detail Locales
 */
export class CountryDetailLocalesDto {
  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  fromYear!: Year | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  languageCode!: IdentityCode;

  @IsString()
  @IsUUID()
  languageId!: Id;

  @ValidateIf((object) => object.languageIso !== null)
  @IsString()
  @Length(2, 2)
  @Matches(new RegExp("^[a-z]{2}$"))
  languageIso!: Iso6391 | null;

  @IsInt()
  @Min(0)
  position!: NonNegativeInteger;

  @IsString()
  @IsUUID()
  statusTerm!: Id;

  @ValidateIf((object) => object.toYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  toYear!: Year | null;
}
