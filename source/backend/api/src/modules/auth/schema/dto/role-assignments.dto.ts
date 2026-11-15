import { IsISO8601, IsOptional, IsString, IsUUID, MaxLength, ValidateIf } from "class-validator";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Scoped role grant to an account, optionally through a membership or delegation, with revocation history. (entity)
 */
export class RoleAssignmentsDto {
  @IsString()
  @IsUUID()
  accountId!: Id;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.delegationId !== null)
  @IsString()
  @IsUUID()
  delegationId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.expiresAt !== null)
  @IsISO8601({})
  expiresAt?: Instant | null;

  @IsString()
  @IsUUID()
  grantedBy!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.membershipId !== null)
  @IsString()
  @IsUUID()
  membershipId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.revocationReason !== null)
  @IsString()
  @MaxLength(4000)
  revocationReason?: Description | null;

  @IsOptional()
  @ValidateIf((object) => object.revokedAt !== null)
  @IsISO8601({})
  revokedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.revokedBy !== null)
  @IsString()
  @IsUUID()
  revokedBy?: Id | null;

  @IsString()
  @IsUUID()
  roleId!: Id;

  @IsString()
  @IsUUID()
  scopeId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.startsAt !== null)
  @IsISO8601({})
  startsAt?: Instant | null;
}
