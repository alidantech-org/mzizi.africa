import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import type { AddressSegment } from "#/modules/identity/schema/type/address-segment.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Readable URL addresses of named things; dated rows keep old addresses resolving. (entity)
 */
export class AddressesDto {
  @IsOptional()
  @ValidateIf((object) => object.canonicalId !== null)
  @IsString()
  @IsUUID()
  canonicalId?: Id | null;

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
  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  fromYear?: Year | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  identityId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.languageId !== null)
  @IsString()
  @IsUUID()
  languageId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.parentId !== null)
  @IsString()
  @IsUUID()
  parentId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.sectionTerm !== null)
  @IsString()
  @IsUUID()
  sectionTerm?: Id | null;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @Matches(new RegExp("^[a-z0-9]+(-[a-z0-9]+)*$"))
  segment!: AddressSegment;

  @IsOptional()
  @ValidateIf((object) => object.toYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  toYear?: Year | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
