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
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One classified amount authorized in a budget version, optionally nested and assigned to a project or unit. (entity)
 */
export class AppropriationsDto {
  @IsInt()
  @Min(0)
  amountMinorUnits!: AmountMinorUnits;

  @IsString()
  @IsUUID()
  budgetVersionId!: Id;

  @IsString()
  @IsUUID()
  classificationId!: Id;

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
  @ValidateIf((object) => object.parentAppropriationId !== null)
  @IsString()
  @IsUUID()
  parentAppropriationId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.projectId !== null)
  @IsString()
  @IsUUID()
  projectId?: Id | null;

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
  @ValidateIf((object) => object.unitFeatureId !== null)
  @IsString()
  @IsUUID()
  unitFeatureId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
