import {
  IsBoolean,
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
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A political donation or in-kind contribution as disclosed. (entity)
 */
export class ContributionsDto {
  @IsOptional()
  @ValidateIf((object) => object.amount !== null)
  @IsInt()
  @Min(0)
  @Satisfies<ContributionsDto>((object) => object.amount == null || object.currencyId != null, {
    message: "Amount Has Currency",
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

  @IsString()
  @IsUUID()
  donorId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.electionId !== null)
  @IsString()
  @IsUUID()
  electionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.givenOn !== null)
  @IsISO8601({ strict: true })
  givenOn?: CalendarDate | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsBoolean()
  isInKind!: Flag;

  @IsString()
  @IsUUID()
  recipientId!: Id;

  @IsString()
  @IsUUID()
  statusTerm!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;

  @IsOptional()
  @ValidateIf((object) => object.versionId !== null)
  @IsString()
  @IsUUID()
  versionId?: Id | null;
}
