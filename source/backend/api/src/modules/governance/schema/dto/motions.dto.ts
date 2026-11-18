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
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One matter put to a sitting, with its outcome, tied to the bill, law provision or budget it concerns. (entity)
 */
export class MotionsDto {
  @IsOptional()
  @ValidateIf((object) => object.billId !== null)
  @IsString()
  @IsUUID()
  billId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.budgetVersionId !== null)
  @IsString()
  @IsUUID()
  budgetVersionId?: Id | null;

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
  @ValidateIf((object) => object.fiscalPeriodId !== null)
  @IsString()
  @IsUUID()
  fiscalPeriodId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.instrumentId !== null)
  @IsString()
  @IsUUID()
  instrumentId?: Id | null;

  @IsString()
  @IsUUID()
  motionKindId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.movedByHolderId !== null)
  @IsString()
  @IsUUID()
  movedByHolderId?: Id | null;

  @IsString()
  @IsUUID()
  outcomeId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.provisionId !== null)
  @IsString()
  @IsUUID()
  provisionId?: Id | null;

  @IsString()
  @IsUUID()
  sittingId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.summary !== null)
  @IsString()
  @MaxLength(4000)
  summary?: Description | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title!: Name;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
