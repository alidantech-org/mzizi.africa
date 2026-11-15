import {
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * External issuer and subject linked to one account; unlinking is recorded, never deleted. (entity)
 */
export class LoginIdentitiesDto {
  @IsString()
  @IsUUID()
  accountId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  issuer!: NonEmptyString500;

  @IsOptional()
  @ValidateIf((object) => object.lastAuthenticatedAt !== null)
  @IsISO8601({})
  lastAuthenticatedAt?: Instant | null;

  @IsISO8601({})
  linkedAt!: Instant;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  subject!: NonEmptyString500;

  @IsOptional()
  @ValidateIf((object) => object.unlinkedAt !== null)
  @IsISO8601({})
  unlinkedAt?: Instant | null;
}
