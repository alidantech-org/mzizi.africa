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
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { JsonText } from "#/types/website/json-text.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Dns Snapshot (entity)
 */
export class DnsSnapshotDto {

  @IsISO8601({})
  createdAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.domainId !== null)
  @IsString()
  @IsUUID()
  domainId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsISO8601({})
  observedAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.rcode !== null)
  @IsString()
  @MinLength(1)
  rcode?: LongText | null;

  @IsString()
  @MinLength(1)
  recordType!: LongText;

  @IsOptional()
  @ValidateIf((object) => object.resolver !== null)
  @IsString()
  @MinLength(1)
  resolver?: LongText | null;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsString()
  @MinLength(2)
  values!: JsonText;

  @IsInt()
  @Min(0)
  version!: Version;

  @IsOptional()
  @ValidateIf((object) => object.zoneId !== null)
  @IsString()
  @IsUUID()
  zoneId?: Id | null;
}