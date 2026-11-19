import {
  IsBoolean,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateIf,
} from "class-validator";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One side of a dispute: a citation and the claim it supports. (entity)
 */
export class ContendersDto {
  @IsString()
  @IsUUID()
  citationId!: Id;

  @IsString()
  @MaxLength(4000)
  claim!: Description;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  disputeId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsBoolean()
  isPreferred!: Flag;

  @IsOptional()
  @ValidateIf((object) => object.position !== null)
  @IsInt()
  @Min(0)
  position?: NonNegativeInteger | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
