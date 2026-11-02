import { Type } from "class-transformer";
import {
  Allow,
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBase64,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsFQDN,
  IsHexadecimal,
  IsHexColor,
  IsInt,
  IsIP,
  IsISO31661Alpha2,
  IsISO4217CurrencyCode,
  IsISO8601,
  IsJSON,
  IsJWT,
  IsLocale,
  IsMimeType,
  IsNumber,
  IsObject,
  IsOptional,
  IsSemVer,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsDivisibleBy,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";

import { Satisfies } from "#/modules/common/dto/validators/satisfies.ts";
import { BaseEntityDto } from "#/modules/shared/dto/base-entity.dto.ts";
import { UploadState } from "#/types/filesystem/upload-state.enum.ts";
import type { FileName } from "#/types/filesystem/file-name.type.ts";
import type { ByteCount } from "#/types/shared/byte-count.type.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Upload Session (entity)
 */
export class UploadSessionDto {

  @IsOptional()
  @ValidateIf((object) => object.completedFileId !== null)
  @IsString()
  @IsUUID()
  completedFileId?: Id | null;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.expectedHash !== null)
  @IsString()
  @MinLength(64)
  @MaxLength(64)
  expectedHash?: Checksum | null;

  @IsInt()
  @Min(0)
  expectedSizeBytes!: ByteCount;

  @IsISO8601({})
  expiresAt!: DateTime;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  fileName!: FileName;

  @IsString()
  @IsUUID()
  folderId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.requestedBy !== null)
  @IsString()
  @IsUUID()
  requestedBy?: Id | null;

  @IsEnum(UploadState)
  state!: UploadState;

  @IsString()
  @IsUUID()
  storeId!: Id;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsInt()
  @Min(0)
  version!: Version;
}