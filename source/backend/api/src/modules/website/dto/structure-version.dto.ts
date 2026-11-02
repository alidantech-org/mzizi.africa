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
import { StructureDto } from "#/modules/website/dto/structure.dto.ts";
import { VersionStatus } from "#/types/website/version-status.enum.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { SchemaVersion } from "#/types/website/schema-version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Structure Version (entity)
 */
export class StructureVersionDto {

  @IsISO8601({})
  createdAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.createdBy !== null)
  @IsString()
  @IsUUID()
  createdBy?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.folderId !== null)
  @IsString()
  @IsUUID()
  folderId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @MinLength(64)
  @MaxLength(64)
  manifestHash!: Checksum;

  @IsOptional()
  @ValidateIf((object) => object.methodId !== null)
  @IsString()
  @IsUUID()
  methodId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.notesSummary !== null)
  @IsString()
  @MaxLength(4000)
  notesSummary?: Description | null;

  @IsInt()
  @Min(0)
  number!: Version;

  @IsString()
  @MinLength(1)
  @MaxLength(60)
  schemaVersion!: SchemaVersion;

  @IsEnum(VersionStatus)
  status!: VersionStatus;

  @IsString()
  @IsUUID()
  structureId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.supersedesId !== null)
  @IsString()
  @IsUUID()
  supersedesId?: Id | null;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.validationReport !== null)
  @IsString()
  @MinLength(1)
  validationReport?: LongText | null;

  @IsInt()
  @Min(0)
  version!: Version;
}