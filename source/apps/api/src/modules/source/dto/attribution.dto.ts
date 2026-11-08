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
import { DocumentDto } from "#/modules/source/dto/document.dto.ts";
import { AttributionRelation } from "#/types/source/attribution-relation.enum.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Locator } from "#/types/source/locator.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Attribution (entity)
 */
export class AttributionDto {

  @IsOptional()
  @ValidateIf((object) => object.attributedBy !== null)
  @IsString()
  @IsUUID()
  attributedBy?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.captureId !== null)
  @IsString()
  @IsUUID()
  captureId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.confidence !== null)
  @IsNumber({})
  @Min(0)
  @Max(1)
  confidence?: Confidence | null;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsString()
  @IsUUID()
  documentId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.locator !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  locator?: Locator | null;

  @IsString()
  @IsUUID()
  methodId!: Id;

  @IsEnum(AttributionRelation)
  relation!: AttributionRelation;

  @IsOptional()
  @ValidateIf((object) => object.targetField !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  targetField?: Label | null;

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