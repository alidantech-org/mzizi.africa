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

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { AmountMinorUnits } from "#/modules/shared/schema/type/amount-minor-units.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One executed contract with a contractor, optional procurement/project links and contracted amount. (entity)
 */
export class ContractsDto {
  @IsInt()
  @Min(0)
  amountMinorUnits!: AmountMinorUnits;

  @IsOptional()
  @ValidateIf((object) => object.buyerEntityId !== null)
  @IsString()
  @IsUUID()
  buyerEntityId?: Id | null;

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
  contractorEntityId!: Id;

  @IsISO8601({})
  createdAt!: Instant;

  @IsString()
  @IsUUID()
  currencyId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.natureId !== null)
  @IsString()
  @IsUUID()
  natureId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.procurementId !== null)
  @IsString()
  @IsUUID()
  @Satisfies<ContractsDto>(
    (object) => object.procurementId != null || object.buyerEntityId != null,
    {
      message: "Has Procurement Or Buyer",
    },
  )
  procurementId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.projectId !== null)
  @IsString()
  @IsUUID()
  projectId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.signedOn !== null)
  @IsISO8601({ strict: true })
  signedOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsString()
  @IsUUID()
  statusId!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
