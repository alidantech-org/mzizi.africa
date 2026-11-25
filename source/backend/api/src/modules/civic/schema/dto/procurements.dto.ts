import {
  IsEnum,
  IsInt,
  IsISO8601,
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
import type { AmountMinorUnits } from "#/modules/shared/schema/type/amount-minor-units.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A tender. Its title is an `identity.names` row and its tender number an `identity.identifiers` row. (entity)
 */
export class ProcurementsDto {
  @IsOptional()
  @ValidateIf((object) => object.amount !== null)
  @IsInt()
  @Min(0)
  @Satisfies<ProcurementsDto>((object) => object.amount == null || object.currencyId != null, {
    message: "Procurement Amount Has Currency",
  })
  amount?: AmountMinorUnits | null;

  @IsOptional()
  @ValidateIf((object) => object.bidderCount !== null)
  @IsInt()
  @Min(0)
  bidderCount?: NonNegativeInteger | null;

  @IsString()
  @IsUUID()
  buyerId!: Id;

  @IsString()
  @IsUUID()
  categoryTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.closesOn !== null)
  @IsISO8601({ strict: true })
  closesOn?: CalendarDate | null;

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
  @ValidateIf((object) => object.currencyId !== null)
  @IsString()
  @IsUUID()
  currencyId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.evaluationTerm !== null)
  @IsString()
  @IsUUID()
  evaluationTerm?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(IdentityKind)
  @Satisfies<ProcurementsDto>((object) => object.identityKind === "procurement", {
    message: "Procurement Kind",
  })
  identityKind!: IdentityKind;

  @IsOptional()
  @ValidateIf((object) => object.natureTerm !== null)
  @IsString()
  @IsUUID()
  natureTerm?: Id | null;

  @IsString()
  @IsUUID()
  procedureTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.projectId !== null)
  @IsString()
  @IsUUID()
  projectId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.publishedOn !== null)
  @IsISO8601({ strict: true })
  publishedOn?: CalendarDate | null;

  @IsString()
  @IsUUID()
  statusTerm!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
