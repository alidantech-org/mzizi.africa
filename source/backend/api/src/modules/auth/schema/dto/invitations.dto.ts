import {
  IsEmail,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  ValidateIf,
} from "class-validator";

import type { Email } from "#/modules/shared/schema/type/email.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Sha256 } from "#/modules/shared/schema/type/sha256.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A single-use invitation to an institution. (entity)
 */
export class InvitationsDto {
  @IsOptional()
  @ValidateIf((object) => object.acceptedAccountId !== null)
  @IsString()
  @IsUUID()
  acceptedAccountId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.acceptedAt !== null)
  @IsISO8601({})
  acceptedAt?: Instant | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.expiresAt !== null)
  @IsISO8601({})
  expiresAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  institutionId!: Id;

  @IsString()
  @IsEmail()
  intendedEmail!: Email;

  @IsString()
  @IsUUID()
  invitedBy!: Id;

  @IsOptional()
  @ValidateIf((object) => object.revokedAt !== null)
  @IsISO8601({})
  revokedAt?: Instant | null;

  @IsString()
  @Length(64, 64)
  @Matches(new RegExp("^[a-f0-9]{64}$"))
  tokenDigest!: Sha256;
}
