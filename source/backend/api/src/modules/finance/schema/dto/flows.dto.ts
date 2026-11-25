import { IsInt, IsISO8601, IsOptional, IsString, IsUUID, Min, ValidateIf } from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { AmountMinorUnits } from "#/modules/shared/schema/type/amount-minor-units.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A movement of public money: allocation, transfer, disbursement, payment or receipt. (entity)
 */
export class FlowsDto {
  @IsOptional()
  @ValidateIf((object) => object.amount !== null)
  @IsInt()
  @Min(0)
  @Satisfies<FlowsDto>((object) => object.amount == null || object.currencyId != null, {
    message: "Flow Amount Has Currency",
  })
  amount?: AmountMinorUnits | null;

  @IsOptional()
  @ValidateIf((object) => object.appropriationId !== null)
  @IsString()
  @IsUUID()
  appropriationId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.classTerm !== null)
  @IsString()
  @IsUUID()
  classTerm?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.contractId !== null)
  @IsString()
  @IsUUID()
  contractId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.counterpartyId !== null)
  @IsString()
  @IsUUID()
  counterpartyId?: Id | null;

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
  @ValidateIf((object) => object.debtId !== null)
  @IsString()
  @IsUUID()
  debtId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.featureId !== null)
  @IsString()
  @IsUUID()
  featureId?: Id | null;

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

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.occurredOn !== null)
  @IsISO8601({ strict: true })
  occurredOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.periodId !== null)
  @IsString()
  @IsUUID()
  periodId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.projectId !== null)
  @IsString()
  @IsUUID()
  projectId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
