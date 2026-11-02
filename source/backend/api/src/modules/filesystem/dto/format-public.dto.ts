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
import { FormatCategory } from "#/types/filesystem/format-category.enum.ts";
import type { Extension } from "#/types/filesystem/extension.type.ts";
import type { MimeType } from "#/types/filesystem/mime-type.type.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { ByteCount } from "#/types/shared/byte-count.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Format Public
 *
 * Derived from Format for read.
 */
export class FormatPublicDto {

  @IsEnum(FormatCategory)
  category!: FormatCategory;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  code!: BusinessCode;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  extension!: Extension;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsBoolean()
  isPreviewable!: Flag;

  @IsOptional()
  @ValidateIf((object) => object.maxSizeBytes !== null)
  @IsInt()
  @Min(0)
  maxSizeBytes?: ByteCount | null;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  mimeType!: MimeType;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsOptional()
  @ValidateIf((object) => object.processingStrategy !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  processingStrategy?: Label | null;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsInt()
  @Min(0)
  version!: Version;
}