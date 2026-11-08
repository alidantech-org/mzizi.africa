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
import { EventKind } from "#/types/filesystem/event-kind.enum.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * File Event (entity)
 */
export class FileEventDto {

  @IsOptional()
  @ValidateIf((object) => object.actorId !== null)
  @IsString()
  @IsUUID()
  actorId?: Id | null;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.detail !== null)
  @IsString()
  @MaxLength(4000)
  detail?: Description | null;

  @IsString()
  @IsUUID()
  fileId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(EventKind)
  kind!: EventKind;

  @IsISO8601({})
  occurredAt!: DateTime;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsInt()
  @Min(0)
  version!: Version;

  @IsOptional()
  @ValidateIf((object) => object.versionId !== null)
  @IsString()
  @IsUUID()
  versionId?: Id | null;
}