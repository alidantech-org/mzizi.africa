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
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * An audit finding about an institution in a fiscal period. (entity)
 */
export class FindingsDto {
  @IsOptional()
  @ValidateIf((object) => object.amount !== null)
  @IsInt()
  @Min(0)
  @Satisfies<FindingsDto>((object) => object.amount == null || object.currencyId != null, {
    message: "Finding Amount Has Currency",
  })
  amount?: AmountMinorUnits | null;

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
  @ValidateIf((object) => object.flowCountryId !== null)
  @IsString()
  @IsUUID()
  flowCountryId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.flowId !== null)
  @IsString()
  @IsUUID()
  @Satisfies<FindingsDto>((object) => object.flowId == null || object.flowCountryId != null, {
    message: "Finding Flow Has Country",
  })
  flowId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  institutionId!: Id;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsString()
  @IsUUID()
  periodId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.projectId !== null)
  @IsString()
  @IsUUID()
  projectId?: Id | null;

  @IsString()
  @IsUUID()
  statusTerm!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
