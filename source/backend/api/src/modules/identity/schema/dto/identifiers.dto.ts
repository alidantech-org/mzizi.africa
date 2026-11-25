import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import { IdentityKind } from "#/modules/shared/schema/enum/identity-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Public identifiers of named things (ISO codes, IEBC codes, Wikidata ids, registration numbers). Personal identifiers such as national ID numbers are never stored. (entity)
 */
export class IdentifiersDto {
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
  @Satisfies<IdentifiersDto>(
    (object) =>
      object.fromYear == null || object.toYear == null || object.fromYear <= object.toYear,
    {
      message: "Identifier Period Is Ordered",
    },
  )
  fromYear?: Year | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  identityId!: Id;

  @IsEnum(IdentityKind)
  identityKind!: IdentityKind;

  @IsOptional()
  @ValidateIf((object) => object.issuerId !== null)
  @IsString()
  @IsUUID()
  issuerId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.namespace !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  namespace?: NonEmptyString255 | null;

  @IsString()
  @IsUUID()
  schemeTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.toYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  toYear?: Year | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  value!: NonEmptyString500;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
