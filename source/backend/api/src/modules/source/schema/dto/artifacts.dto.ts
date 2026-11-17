import {
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

import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { NonNegativeInt64 } from "#/modules/shared/schema/type/non-negative-int64.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Sha256 } from "#/modules/shared/schema/type/sha256.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One exact representation of an edition, tied to immutable bytes. Identical downloads from many sources are one artifact with many captures. (entity)
 */
export class ArtifactsDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsOptional()
  @ValidateIf((object) => object.contentType !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  contentType?: NonEmptyString255 | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.description !== null)
  @IsString()
  @MaxLength(4000)
  description?: Description | null;

  @IsString()
  @IsUUID()
  editionId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.fileVersionId !== null)
  @IsString()
  @IsUUID()
  fileVersionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.format !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  format?: NonEmptyString100 | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.location !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  location?: NonEmptyString1000 | null;

  @IsOptional()
  @ValidateIf((object) => object.parentId !== null)
  @IsString()
  @IsUUID()
  parentId?: Id | null;

  @IsString()
  @Length(64, 64)
  @Matches(new RegExp("^[a-f0-9]{64}$"))
  sha256!: Sha256;

  @IsOptional()
  @ValidateIf((object) => object.sizeBytes !== null)
  @IsInt()
  @Min(0)
  sizeBytes?: NonNegativeInt64 | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
