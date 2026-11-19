import {
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

import type { AmountMinorUnits } from "#/modules/shared/schema/type/amount-minor-units.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One reported financial flow at its source transaction grain, not a rolled-up aggregate. (entity)
 *
 * Invariant "AtMostOneCounterparty" has no simple form, so it isn't validated here.
 */
export class FlowsDto {
  @IsInt()
  @Min(0)
  amountMinorUnits!: AmountMinorUnits;

  @IsOptional()
  @ValidateIf((object) => object.appropriationId !== null)
  @IsString()
  @IsUUID()
  appropriationId?: Id | null;

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
  @ValidateIf((object) => object.contractId !== null)
  @IsString()
  @IsUUID()
  contractId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.counterpartyEntityId !== null)
  @IsString()
  @IsUUID()
  counterpartyEntityId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.counterpartyIndividualId !== null)
  @IsString()
  @IsUUID()
  counterpartyIndividualId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsString()
  @IsUUID()
  currencyId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.debtId !== null)
  @IsString()
  @IsUUID()
  debtId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.expenditureClassId !== null)
  @IsString()
  @IsUUID()
  expenditureClassId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.fiscalPeriodId !== null)
  @IsString()
  @IsUUID()
  fiscalPeriodId?: Id | null;

  @IsString()
  @IsUUID()
  flowKindId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.fundId !== null)
  @IsString()
  @IsUUID()
  fundId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.institutionId !== null)
  @IsString()
  @IsUUID()
  institutionId?: Id | null;

  @IsISO8601({ strict: true })
  occurredOn!: CalendarDate;

  @IsOptional()
  @ValidateIf((object) => object.projectId !== null)
  @IsString()
  @IsUUID()
  projectId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.scopeUnitFeatureId !== null)
  @IsString()
  @IsUUID()
  scopeUnitFeatureId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
