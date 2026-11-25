import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import type { TextVersion } from "#/modules/community/schema/type/text-version.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A consent an actor gave or withdrew, with the exact text version. (entity)
 */
export class ConsentsDto {
  @IsString()
  @IsUUID()
  actorId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.countryId !== null)
  @IsString()
  @IsUUID()
  countryId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsISO8601({})
  givenAt!: Instant;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  keyId!: Id;

  @IsString()
  @IsUUID()
  purposeTerm!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  textVersion!: TextVersion;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;

  @IsOptional()
  @ValidateIf((object) => object.withdrawnAt !== null)
  @IsISO8601({})
  withdrawnAt?: Instant | null;
}
