import {
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateIf,
} from "class-validator";

import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Percentage } from "#/modules/shared/schema/type/percentage.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * The people and organisations involved in procurement, contracts and projects, and how. (entity)
 *
 * Invariant "RoleHasOneRow" has no simple form, so it isn't validated here.
 *
 * Invariant "RoleHasOneActor" has no simple form, so it isn't validated here.
 */
export class RolesDto {
  @IsOptional()
  @ValidateIf((object) => object.actedOn !== null)
  @IsISO8601({ strict: true })
  actedOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.bidId !== null)
  @IsString()
  @IsUUID()
  bidId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.contractId !== null)
  @IsString()
  @IsUUID()
  contractId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.holderId !== null)
  @IsString()
  @IsUUID()
  holderId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.identityId !== null)
  @IsString()
  @IsUUID()
  identityId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.procurementId !== null)
  @IsString()
  @IsUUID()
  procurementId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.projectId !== null)
  @IsString()
  @IsUUID()
  projectId?: Id | null;

  @IsString()
  @IsUUID()
  roleTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.share !== null)
  @IsNumber({})
  @Min(0)
  @Max(100)
  share?: Percentage | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
