import {
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
import { IdentityKind } from "#/modules/shared/schema/enum/identity-kind.enum.ts";
import type { Factor } from "#/modules/reference/schema/type/factor.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A unit of measurement and its exact conversion to a base unit; never a spatial unit. (entity)
 */
export class UnitsDto {
  @IsOptional()
  @ValidateIf((object) => object.baseId !== null)
  @IsString()
  @IsUUID()
  baseId?: Id | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(IdentityKind)
  @Satisfies<UnitsDto>((object) => object.identityKind === "unit", {
    message: "Unit Kind",
  })
  identityKind!: IdentityKind;

  @IsNumber({})
  offset!: Factor;

  @IsString()
  @IsUUID()
  quantityTerm!: Id;

  @IsNumber({})
  @Satisfies<UnitsDto>((object) => object.scale > 0, {
    message: "Unit Scale Is Positive",
  })
  scale!: Factor;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  symbol!: NonEmptyString100;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
