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
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A duty to report or publish, with who owes it, to whom, how often and the law that creates it. Each filing found is a report. (entity)
 */
export class ObligationsDto {
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

  @IsString()
  @IsUUID()
  countryId!: Id;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @MaxLength(4000)
  description!: Description;

  @IsString()
  @IsUUID()
  frequencyId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.fromToPrecision !== null)
  @IsEnum(DatePrecision)
  fromToPrecision?: DatePrecision | null;

  @IsOptional()
  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  @Satisfies<ObligationsDto>(
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
  obligationKindId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.obligorInstitutionId !== null)
  @IsString()
  @IsUUID()
  @Satisfies<ObligationsDto>(
    (object) => object.obligorInstitutionId != null || object.obligorKindId != null,
    {
      message: "One Obligor Form",
    },
  )
  obligorInstitutionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.obligorKindId !== null)
  @IsString()
  @IsUUID()
  obligorKindId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.recipientEntityId !== null)
  @IsString()
  @IsUUID()
  recipientEntityId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

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
