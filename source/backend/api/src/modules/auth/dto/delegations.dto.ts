
import {
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from "class-validator";

import type { Id } from "#/modules/shared/id.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/**
 * Time-limited delegation of scoped access from one account to another. (entity)
 */
export class DelegationsDto {

  @IsISO8601({})
  createdAt!: Instant;

  @IsString()
  @IsUUID()
  delegateAccountId!: Id;

  @IsString()
  @IsUUID()
  delegatorAccountId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.expiresAt !== null)
  @IsISO8601({})
  expiresAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

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
  scopeId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.startsAt !== null)
  @IsISO8601({})
  startsAt?: Instant | null;
}