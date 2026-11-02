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
import { LaunchStage } from "#/types/website/launch-stage.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { JsonText } from "#/types/website/json-text.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Dossier (entity)
 */
export class DossierDto {

  @IsString()
  @MinLength(2)
  applicableLaws!: JsonText;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsBoolean()
  isCurrent!: Flag;

  @IsString()
  @IsUUID()
  jurisdictionId!: Id;

  @IsEnum(LaunchStage)
  launchStage!: LaunchStage;

  @IsOptional()
  @ValidateIf((object) => object.legislationRepositoryUrl !== null)
  @IsString()
  @IsUrl()
  @MaxLength(1000)
  legislationRepositoryUrl?: Url | null;

  @IsOptional()
  @ValidateIf((object) => object.openQuestions !== null)
  @IsString()
  @MinLength(1)
  openQuestions?: LongText | null;

  @IsOptional()
  @ValidateIf((object) => object.regulator !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  regulator?: Name | null;

  @IsOptional()
  @ValidateIf((object) => object.reviewDueAt !== null)
  @IsISO8601({})
  reviewDueAt?: DateTime | null;

  @IsOptional()
  @ValidateIf((object) => object.reviewedAt !== null)
  @IsISO8601({})
  reviewedAt?: DateTime | null;

  @IsOptional()
  @ValidateIf((object) => object.reviewerId !== null)
  @IsString()
  @IsUUID()
  reviewerId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.supersedesId !== null)
  @IsString()
  @IsUUID()
  supersedesId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.treatyStatus !== null)
  @IsString()
  @MinLength(2)
  treatyStatus?: JsonText | null;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsInt()
  @Min(0)
  version!: Version;
}