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
import { FileDto } from "#/modules/filesystem/dto/file.dto.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * File Version Public
 *
 * Derived from FileVersion for read.
 */
export class FileVersionPublicDto {

  @IsISO8601({})
  createdAt!: DateTime;

  @IsString()
  @IsUUID()
  fileId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.note !== null)
  @IsString()
  @MaxLength(4000)
  note?: Description | null;

  @IsString()
  @IsUUID()
  objectId!: Id;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.uploadedBy !== null)
  @IsString()
  @IsUUID()
  uploadedBy?: Id | null;

  @IsInt()
  @Min(0)
  version!: Version;

  @IsInt()
  @Min(0)
  versionNumber!: Version;
}