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
import type { DocumentFormat } from "#/types/exchange/document-format.type.ts";
import type { Sha256 } from "#/types/exchange/sha256.type.ts";
import type { ByteCount } from "#/types/shared/byte-count.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * File Artifact Ref
 */
export class FileArtifactRefDto {

  @IsOptional()
  @IsString()
  @IsUUID()
  captureId?: Id;

  @IsString()
  @MinLength(64)
  @MaxLength(64)
  contentHash!: Sha256;

  @IsOptional()
  @IsString()
  @IsUUID()
  documentId?: Id;

  @IsString()
  @IsUUID()
  fileVersionId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  mimeType!: DocumentFormat;

  @IsOptional()
  @IsISO8601({})
  retrievedAt?: DateTime;

  @IsInt()
  @Min(0)
  sizeBytes!: ByteCount;

  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(1000)
  sourceUrl?: Url;
}