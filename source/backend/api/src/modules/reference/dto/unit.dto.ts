
import {
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

import { Satisfies } from "#/modules/common/dto/validators/satisfies.ts";
import type { Factor } from "#/modules/reference/type/factor.type.ts";
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/type/non-empty-string100.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/type/instant.type.ts";

/**
 * Measurement unit and conversion to its optional base unit; never a spatial unit. (entity)
 */
export class UnitDto {

  @IsOptional()
  @ValidateIf((object) => object.baseId !== null)
  @IsString()
  @IsUUID()
  baseId?: Id | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(new RegExp("^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"))
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

  @IsNumber({})
  offset!: Factor;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  quantity!: NonEmptyString255;

  @IsNumber({})
  @Satisfies<UnitDto>((object) => object.scale > 0, {
    message: "Unit Scale Must Be Positive",
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