
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
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

import { Access } from "#/modules/filesystem/access.enum.ts";
import type { Flag } from "#/modules/shared/flag.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { JsonText } from "#/modules/shared/json-text.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/non-empty-string1000.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/non-empty-string500.type.ts";
import type { NonNegativeInt64 } from "#/modules/shared/non-negative-int64.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Sha256 } from "#/modules/shared/sha256.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/**
 * Immutable exact bytes in the mzizi bucket; verify object hash, size and access before acceptance. (entity)
 */
export class FileVersionsDto {

  @IsEnum(Access)
  access!: Access;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  contentType!: NonEmptyString255;

  @IsISO8601({})
  createdAt!: Instant;

  @IsString()
  @IsJSON()
  createdBySnapshot!: JsonText;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.fileExtensionId !== null)
  @IsString()
  @IsUUID()
  fileExtensionId?: Id | null;

  @IsString()
  @IsUUID()
  fileId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.originalFilename !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  originalFilename?: NonEmptyString500 | null;

  @IsBoolean()
  pinned!: Flag;

  @IsString()
  @IsJSON()
  provenance!: JsonText;

  @IsInt()
  @Min(1)
  revision!: PositiveInteger;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  s3Key!: NonEmptyString1000;

  @IsString()
  @Length(64, 64)
  @Matches(new RegExp("^[a-f0-9]{64}$"))
  sha256!: Sha256;

  @IsInt()
  @Min(0)
  sizeBytes!: NonNegativeInt64;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsISO8601({})
  verifiedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}