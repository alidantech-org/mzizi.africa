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
import { StoreDto } from "#/modules/filesystem/dto/store.dto.ts";
import { BaseEntityDto } from "#/modules/shared/dto/base-entity.dto.ts";
import { ScanStatus } from "#/types/filesystem/scan-status.enum.ts";
import type { Dimension } from "#/types/filesystem/dimension.type.ts";
import type { ObjectKey } from "#/types/filesystem/object-key.type.ts";
import type { Seconds } from "#/types/filesystem/seconds.type.ts";
import type { ByteCount } from "#/types/shared/byte-count.type.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Stored Object (entity)
 */
export class StoredObjectDto {

  @IsString()
  @MinLength(64)
  @MaxLength(64)
  contentHash!: Checksum;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.durationSeconds !== null)
  @IsNumber({})
  durationSeconds?: Seconds | null;

  @IsOptional()
  @ValidateIf((object) => object.formatId !== null)
  @IsString()
  @IsUUID()
  formatId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.mediaHeight !== null)
  @IsInt()
  @Min(0)
  mediaHeight?: Dimension | null;

  @IsOptional()
  @ValidateIf((object) => object.mediaWidth !== null)
  @IsInt()
  @Min(0)
  mediaWidth?: Dimension | null;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  objectKey!: ObjectKey;

  @IsOptional()
  @ValidateIf((object) => object.pageCount !== null)
  @IsInt()
  @Min(0)
  pageCount?: Dimension | null;

  @IsEnum(ScanStatus)
  scanStatus!: ScanStatus;

  @IsInt()
  @Min(0)
  sizeBytes!: ByteCount;

  @IsString()
  @IsUUID()
  storeId!: Id;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsInt()
  @Min(0)
  version!: Version;
}