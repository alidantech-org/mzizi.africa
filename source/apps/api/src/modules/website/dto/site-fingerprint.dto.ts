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
import { SiteDto } from "#/modules/website/dto/site.dto.ts";
import { FingerprintKind } from "#/types/website/fingerprint-kind.enum.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Site Fingerprint (entity)
 */
export class SiteFingerprintDto {

  @IsOptional()
  @ValidateIf((object) => object.checkId !== null)
  @IsString()
  @IsUUID()
  checkId?: Id | null;

  @IsISO8601({})
  computedAt!: DateTime;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsString()
  @MinLength(64)
  @MaxLength(64)
  digest!: Checksum;

  @IsString()
  @MinLength(1)
  features!: LongText;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(FingerprintKind)
  kind!: FingerprintKind;

  @IsString()
  @IsUUID()
  siteId!: Id;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsInt()
  @Min(0)
  version!: Version;
}