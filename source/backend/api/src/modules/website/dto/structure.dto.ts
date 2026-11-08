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
import { StructureOwnerKind } from "#/types/website/structure-owner-kind.enum.ts";
import { StructureStatus } from "#/types/website/structure-status.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Purpose } from "#/types/website/purpose.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Structure (entity)
 */
export class StructureDto {

  @IsISO8601({})
  createdAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.currentVersionId !== null)
  @IsString()
  @IsUUID()
  currentVersionId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  ownerId!: Id;

  @IsEnum(StructureOwnerKind)
  ownerKind!: StructureOwnerKind;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  purpose!: Purpose;

  @IsEnum(StructureStatus)
  status!: StructureStatus;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsInt()
  @Min(0)
  version!: Version;
}