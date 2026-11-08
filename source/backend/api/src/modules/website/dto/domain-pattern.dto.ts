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
import { SiteFamilyDto } from "#/modules/website/dto/site-family.dto.ts";
import { DomainRole } from "#/types/website/domain-role.enum.ts";
import { PatternStatus } from "#/types/website/pattern-status.enum.ts";
import { UrlScheme } from "#/types/website/url-scheme.enum.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DomainTemplate } from "#/types/website/domain-template.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Domain Pattern (entity)
 */
export class DomainPatternDto {

  @IsISO8601({})
  createdAt!: DateTime;

  @IsEnum(DomainRole)
  domainRole!: DomainRole;

  @IsString()
  @IsUUID()
  familyId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.notes !== null)
  @IsString()
  @MaxLength(4000)
  notes?: Description | null;

  @IsEnum(UrlScheme)
  scheme!: UrlScheme;

  @IsEnum(PatternStatus)
  status!: PatternStatus;

  @IsString()
  @MinLength(3)
  @MaxLength(300)
  template!: DomainTemplate;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsString()
  @MinLength(1)
  variables!: LongText;

  @IsInt()
  @Min(0)
  version!: Version;
}