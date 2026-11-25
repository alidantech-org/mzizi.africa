import { IsInt, IsISO8601, IsOptional, IsString, IsUUID, Min, ValidateIf } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Per-country order of trust for choosing the figure to show (Kenya ranks KNBS first). (entity)
 *
 * Invariant "PriorityHasOneSource" has no simple form, so it isn't validated here.
 */
export class PrioritiesDto {
  @IsOptional()
  @ValidateIf((object) => object.collectionId !== null)
  @IsString()
  @IsUUID()
  collectionId?: Id | null;

  @IsString()
  @IsUUID()
  countryId!: Id;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsInt()
  @Min(0)
  position!: NonNegativeInteger;

  @IsOptional()
  @ValidateIf((object) => object.stewardId !== null)
  @IsString()
  @IsUUID()
  stewardId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
