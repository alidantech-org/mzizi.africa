import {
  IsBoolean,
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
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One right held in law by a position or body over another, with its place in a procedure, the threshold and the provision that creates it. Influence is computed from these rows, never stored. (entity)
 *
 * Invariant "HasExactlyOneHolder" has no simple form, so it isn't validated here.
 *
 * Invariant "HasExactlyOneTarget" has no simple form, so it isn't validated here.
 */
export class PowersDto {
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
  @ValidateIf((object) => object.fromToPrecision !== null)
  @IsEnum(DatePrecision)
  fromToPrecision?: DatePrecision | null;

  @IsOptional()
  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  @Satisfies<PowersDto>(
    (object) =>
      object.fromYear == null || object.toYear == null || object.fromYear <= object.toYear,
    {
      message: "Period Years Are Ordered",
    },
  )
  fromYear?: Year | null;

  @IsOptional()
  @ValidateIf((object) => object.holderInstitutionId !== null)
  @IsString()
  @IsUUID()
  holderInstitutionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.holderPositionId !== null)
  @IsString()
  @IsUUID()
  holderPositionId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsBoolean()
  isBinding!: Flag;

  @IsString()
  @IsUUID()
  kindId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.procedureId !== null)
  @IsString()
  @IsUUID()
  procedureId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.stepOrder !== null)
  @IsInt()
  @Min(1)
  stepOrder?: PositiveInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.targetInstitutionId !== null)
  @IsString()
  @IsUUID()
  targetInstitutionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.targetPositionId !== null)
  @IsString()
  @IsUUID()
  targetPositionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.thresholdId !== null)
  @IsString()
  @IsUUID()
  thresholdId?: Id | null;

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
