import {
  IsBoolean,
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
import type { NameText } from "#/modules/identity/schema/type/name-text.type.ts";
import type { Iso6391 } from "#/modules/reference/schema/type/iso6391.type.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * Party Detail Names
 */
export class PartyDetailNamesDto {
  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  fromYear!: Year | null;

  @IsBoolean()
  isDefault!: Flag;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  languageCode!: IdentityCode;

  @ValidateIf((object) => object.languageIso !== null)
  @IsString()
  @Length(2, 2)
  @Matches(new RegExp("^[a-z]{2}$"))
  languageIso!: Iso6391 | null;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  text!: NameText;

  @ValidateIf((object) => object.toYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  toYear!: Year | null;
}
