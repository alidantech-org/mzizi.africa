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
import type { AttachmentRole } from "#/types/filesystem/attachment-role.type.ts";
import type { Count } from "#/types/shared/count.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * File Attachment Public
 *
 * Derived from FileAttachment for read.
 */
export class FileAttachmentPublicDto {

  @IsISO8601({})
  createdAt!: DateTime;

  @IsString()
  @IsUUID()
  fileId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsInt()
  @Min(0)
  position!: Count;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  role!: AttachmentRole;

  @IsString()
  @IsUUID()
  targetId!: Id;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  targetKind!: TargetKind;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsInt()
  @Min(0)
  version!: Version;
}