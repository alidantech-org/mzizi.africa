import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import { TermStatus } from "#/modules/vocabulary/schema/enum/term-status.enum.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { ColorToken } from "#/modules/vocabulary/schema/type/color-token.type.ts";
import type { IconCode } from "#/modules/vocabulary/schema/type/icon-code.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A member of one scheme: a code, its place in the scheme, display hints and optional numeric band. No display text: words are `vocabulary.labels`. (entity)
 *
 * Invariant "BandHasUnit" has no simple form, so it isn't validated here.
 */
export class TermsDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsOptional()
  @ValidateIf((object) => object.colorToken !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  colorToken?: ColorToken | null;

  @IsOptional()
  @ValidateIf((object) => object.countryId !== null)
  @IsString()
  @IsUUID()
  countryId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.iconCode !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  iconCode?: IconCode | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.lower !== null)
  @IsNumber({})
  @Satisfies<TermsDto>(
    (object) => object.lower == null || object.upper == null || object.lower <= object.upper,
    {
      message: "Band Is Ordered",
    },
  )
  lower?: Number | null;

  @IsOptional()
  @ValidateIf((object) => object.lowerInclusive !== null)
  @IsBoolean()
  lowerInclusive?: Flag | null;

  @IsOptional()
  @ValidateIf((object) => object.parentId !== null)
  @IsString()
  @IsUUID()
  @Satisfies<TermsDto>((object) => object.parentId !== object.id, {
    message: "Term Is Not Its Own Parent",
  })
  parentId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.position !== null)
  @IsInt()
  @Min(0)
  position?: NonNegativeInteger | null;

  @IsString()
  @IsUUID()
  schemeId!: Id;

  @IsEnum(TermStatus)
  status!: TermStatus;

  @IsOptional()
  @ValidateIf((object) => object.supersedesId !== null)
  @IsString()
  @IsUUID()
  supersedesId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.unitId !== null)
  @IsString()
  @IsUUID()
  unitId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.upper !== null)
  @IsNumber({})
  upper?: Number | null;

  @IsOptional()
  @ValidateIf((object) => object.upperInclusive !== null)
  @IsBoolean()
  upperInclusive?: Flag | null;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
