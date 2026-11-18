import { IsInt, IsISO8601, IsOptional, IsString, IsUUID, Min, ValidateIf } from "class-validator";

import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One organisation or person taking part in one occurrence in a role. (entity)
 *
 * Invariant "ExactlyOneParticipant" has no simple form, so it isn't validated here.
 */
export class ParticipantsDto {
  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.entityId !== null)
  @IsString()
  @IsUUID()
  entityId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.individualId !== null)
  @IsString()
  @IsUUID()
  individualId?: Id | null;

  @IsString()
  @IsUUID()
  occurrenceId!: Id;

  @IsString()
  @IsUUID()
  roleId!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
