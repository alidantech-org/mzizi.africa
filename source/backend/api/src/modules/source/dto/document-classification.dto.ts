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
import { ClassifierMethod } from "#/types/source/classifier-method.enum.ts";
import { RouteStatus } from "#/types/source/route-status.enum.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DocumentKindCode } from "#/types/source/document-kind-code.type.ts";
import type { ToolName } from "#/types/source/tool-name.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Document Classification (entity)
 */
export class DocumentClassificationDto {

  @IsISO8601({})
  classifiedAt!: DateTime;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  classifierVersion!: ToolName;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsString()
  @IsUUID()
  documentId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.evidence !== null)
  @IsString()
  @MinLength(1)
  evidence?: LongText | null;

  @IsOptional()
  @ValidateIf((object) => object.facts !== null)
  @IsString()
  @MinLength(1)
  facts?: LongText | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @MinLength(2)
  @MaxLength(60)
  kind!: DocumentKindCode;

  @IsEnum(ClassifierMethod)
  method!: ClassifierMethod;

  @IsOptional()
  @ValidateIf((object) => object.routeParser !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  routeParser?: ToolName | null;

  @IsEnum(RouteStatus)
  routeStatus!: RouteStatus;

  @IsNumber({})
  @Min(0)
  @Max(1)
  score!: Confidence;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsInt()
  @Min(0)
  version!: Version;
}