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
import type { Count } from "#/types/shared/count.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { SectionLabel } from "#/types/website/section-label.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Section Visit (entity)
 */
export class SectionVisitDto {

  @IsISO8601({})
  createdAt!: DateTime;

  @IsInt()
  @Min(0)
  depth!: Count;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsInt()
  @Min(0)
  itemsFound!: Count;

  @IsOptional()
  @ValidateIf((object) => object.pageUrl !== null)
  @IsString()
  @IsUrl()
  @MaxLength(1000)
  pageUrl?: Url | null;

  @IsOptional()
  @ValidateIf((object) => object.ruleIndex !== null)
  @IsInt()
  @Min(0)
  ruleIndex?: Count | null;

  @IsString()
  @MinLength(2)
  @MaxLength(60)
  sectionLabel!: SectionLabel;

  @IsString()
  @IsUUID()
  siteId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.structureVersionId !== null)
  @IsString()
  @IsUUID()
  structureVersionId?: Id | null;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsInt()
  @Min(0)
  version!: Version;

  @IsISO8601({})
  visitedAt!: DateTime;
}