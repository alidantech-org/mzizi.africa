
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
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/type/non-empty-string255.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/type/non-empty-string500.type.ts";
import type { PositiveInteger } from "#/modules/shared/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/type/instant.type.ts";

/**
 * A preserved identifier assigned to a feature by an external geographic registry or source system. (entity)
 */
export class IdentifiersDto {

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  externalId!: NonEmptyString500;

  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  identifierSchemeId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.namespace !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  namespace?: NonEmptyString255 | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceRefId !== null)
  @IsString()
  @IsUUID()
  sourceRefId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}