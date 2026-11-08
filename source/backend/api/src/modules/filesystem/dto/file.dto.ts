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
import { FolderDto } from "#/modules/filesystem/dto/folder.dto.ts";
import { BaseEntityDto } from "#/modules/shared/dto/base-entity.dto.ts";
import { FileStatus } from "#/types/filesystem/file-status.enum.ts";
import { Visibility } from "#/types/filesystem/visibility.enum.ts";
import type { FileName } from "#/types/filesystem/file-name.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * File (entity)
 */
export class FileDto {

  @IsISO8601({})
  createdAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.currentVersionId !== null)
  @IsString()
  @IsUUID()
  currentVersionId?: Id | null;

  @IsString()
  @IsUUID()
  folderId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsBoolean()
  isLegalHold!: Flag;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: FileName;

  @IsOptional()
  @ValidateIf((object) => object.ownerAccountId !== null)
  @IsString()
  @IsUUID()
  ownerAccountId?: Id | null;

  @IsEnum(FileStatus)
  status!: FileStatus;

  @IsOptional()
  @ValidateIf((object) => object.trashedAt !== null)
  @IsISO8601({})
  trashedAt?: DateTime | null;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsInt()
  @Min(0)
  version!: Version;

  @IsEnum(Visibility)
  visibility!: Visibility;
}