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
import { StoredObjectDto } from "#/modules/filesystem/dto/stored-object.dto.ts";
import { BaseEntityDto } from "#/modules/shared/dto/base-entity.dto.ts";
import { VariantKind } from "#/types/filesystem/variant-kind.enum.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * File Variant (entity)
 */
export class FileVariantDto {

  @IsISO8601({})
  createdAt!: DateTime;

  @IsString()
  @IsUUID()
  derivedObjectId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(VariantKind)
  kind!: VariantKind;

  @IsString()
  @IsUUID()
  objectId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.parameters !== null)
  @IsString()
  @MaxLength(4000)
  parameters?: Description | null;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsInt()
  @Min(0)
  version!: Version;
}