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
import { SiteDto } from "#/modules/website/dto/site.dto.ts";
import { SubjectRelation } from "#/types/website/subject-relation.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Site Subject Public
 *
 * Derived from SiteSubject for read.
 */
export class SiteSubjectPublicDto {

  @IsISO8601({})
  createdAt!: DateTime;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(SubjectRelation)
  relation!: SubjectRelation;

  @IsString()
  @IsUUID()
  siteId!: Id;

  @IsString()
  @IsUUID()
  targetId!: Id;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  targetKind!: TargetKind;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.validFrom !== null)
  @IsISO8601({ strict: true })
  validFrom?: Date | null;

  @IsOptional()
  @ValidateIf((object) => object.validTo !== null)
  @IsISO8601({ strict: true })
  validTo?: Date | null;

  @IsInt()
  @Min(0)
  version!: Version;
}