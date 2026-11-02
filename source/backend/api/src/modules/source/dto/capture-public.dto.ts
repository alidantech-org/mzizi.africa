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
import { DocumentDto } from "#/modules/source/dto/document.dto.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { HttpStatus } from "#/types/source/http-status.type.ts";
import type { ToolName } from "#/types/source/tool-name.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Capture Public
 *
 * Derived from Capture for read.
 */
export class CapturePublicDto {

  @IsOptional()
  @ValidateIf((object) => object.contentHash !== null)
  @IsString()
  @MinLength(64)
  @MaxLength(64)
  contentHash?: Checksum | null;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsString()
  @IsUUID()
  documentId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.domainId !== null)
  @IsString()
  @IsUUID()
  domainId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.familyVersionId !== null)
  @IsString()
  @IsUUID()
  familyVersionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.fileVersionId !== null)
  @IsString()
  @IsUUID()
  fileVersionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.httpStatus !== null)
  @IsInt()
  @Min(100)
  @Max(599)
  httpStatus?: HttpStatus | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsISO8601({})
  retrievedAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.retrievedBy !== null)
  @IsString()
  @IsUUID()
  retrievedBy?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.retrievedUrl !== null)
  @IsString()
  @IsUrl()
  @MaxLength(1000)
  retrievedUrl?: Url | null;

  @IsOptional()
  @ValidateIf((object) => object.siteId !== null)
  @IsString()
  @IsUUID()
  siteId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.structureVersionId !== null)
  @IsString()
  @IsUUID()
  structureVersionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.tool !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  tool?: ToolName | null;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsInt()
  @Min(0)
  version!: Version;
}