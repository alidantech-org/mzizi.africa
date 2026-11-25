import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { AttestationStatus } from "#/modules/community/schema/enum/attestation-status.enum.ts";
import { Platform } from "#/modules/community/schema/enum/platform.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Sha256 } from "#/modules/shared/schema/type/sha256.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A device an actor uses. (entity)
 */
export class DevicesDto {
  @IsString()
  @IsUUID()
  actorId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.appVersion !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  appVersion?: NonEmptyString100 | null;

  @IsEnum(AttestationStatus)
  attestation!: AttestationStatus;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @Length(64, 64)
  @Matches(new RegExp("^[a-f0-9]{64}$"))
  fingerprintHash!: Sha256;

  @IsISO8601({})
  firstSeenAt!: Instant;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsISO8601({})
  lastSeenAt!: Instant;

  @IsEnum(Platform)
  platform!: Platform;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
