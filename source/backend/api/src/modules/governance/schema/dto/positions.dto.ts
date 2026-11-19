import {
  IsEnum,
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

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A kind of office with its seat rule: how it is filled, how many seats exist and where, the term, the legal basis. Offices are the individual seats of a position; holders are never part of it. (entity)
 */
export class PositionsDto {
  @IsOptional()
  @ValidateIf((object) => object.basisProvisionId !== null)
  @IsString()
  @IsUUID()
  basisProvisionId?: Id | null;

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

  @IsOptional()
  @ValidateIf((object) => object.displayOrder !== null)
  @IsInt()
  @Min(0)
  displayOrder?: NonNegativeInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.exposureId !== null)
  @IsString()
  @IsUUID()
  exposureId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.fromToPrecision !== null)
  @IsEnum(DatePrecision)
  fromToPrecision?: DatePrecision | null;

  @IsOptional()
  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  @Satisfies<PositionsDto>(
    (object) =>
      object.fromYear == null || object.toYear == null || object.fromYear <= object.toYear,
    {
      message: "Period Years Are Ordered",
    },
  )
  fromYear?: Year | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  institutionId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.jurisdictionLevelId !== null)
  @IsString()
  @IsUUID()
  jurisdictionLevelId?: Id | null;

  @IsString()
  @IsUUID()
  roleId!: Id;

  @IsString()
  @IsUUID()
  seatBasisId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.seatCount !== null)
  @IsInt()
  @Min(1)
  seatCount?: PositiveInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.seatUnitLevelId !== null)
  @IsString()
  @IsUUID()
  seatUnitLevelId?: Id | null;

  @IsString()
  @IsUUID()
  selectionMethodId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.termLimit !== null)
  @IsInt()
  @Min(1)
  termLimit?: PositiveInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.termYears !== null)
  @IsInt()
  @Min(1)
  termYears?: PositiveInteger | null;

  @IsString()
  @IsUUID()
  titleId!: Id;

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
