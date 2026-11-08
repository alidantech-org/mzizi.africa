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
import { AccessBasis } from "#/types/website/access-basis.enum.ts";
import { AssessmentSourceType } from "#/types/website/assessment-source-type.enum.ts";
import { LegalReviewStatus } from "#/types/website/legal-review-status.enum.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { JsonText } from "#/types/website/json-text.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Assessment (entity)
 */
export class AssessmentDto {

  @IsEnum(AccessBasis)
  accessBasis!: AccessBasis;

  @IsOptional()
  @ValidateIf((object) => object.accessConditions !== null)
  @IsString()
  @MinLength(1)
  accessConditions?: LongText | null;

  @IsString()
  @MinLength(2)
  approvedScope!: JsonText;

  @IsOptional()
  @ValidateIf((object) => object.conditions !== null)
  @IsString()
  @MinLength(2)
  conditions?: JsonText | null;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.evidence !== null)
  @IsString()
  @MinLength(2)
  evidence?: JsonText | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsBoolean()
  isCurrent!: Flag;

  @IsOptional()
  @ValidateIf((object) => object.jurisdictionId !== null)
  @IsString()
  @IsUUID()
  jurisdictionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.lawfulBasis !== null)
  @IsString()
  @MaxLength(4000)
  lawfulBasis?: Description | null;

  @IsOptional()
  @ValidateIf((object) => object.licenceName !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  licenceName?: Name | null;

  @IsOptional()
  @ValidateIf((object) => object.licenceUrl !== null)
  @IsString()
  @IsUrl()
  @MaxLength(1000)
  licenceUrl?: Url | null;

  @IsOptional()
  @ValidateIf((object) => object.licenceVersion !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  licenceVersion?: Label | null;

  @IsString()
  @MinLength(2)
  personalDataCategories!: JsonText;

  @IsOptional()
  @ValidateIf((object) => object.processingPurpose !== null)
  @IsString()
  @MaxLength(4000)
  processingPurpose?: Description | null;

  @IsOptional()
  @ValidateIf((object) => object.rationale !== null)
  @IsString()
  @MinLength(1)
  rationale?: LongText | null;

  @IsOptional()
  @ValidateIf((object) => object.reviewDueAt !== null)
  @IsISO8601({})
  reviewDueAt?: DateTime | null;

  @IsOptional()
  @ValidateIf((object) => object.reviewedAt !== null)
  @IsISO8601({})
  reviewedAt?: DateTime | null;

  @IsOptional()
  @ValidateIf((object) => object.reviewedBy !== null)
  @IsString()
  @IsUUID()
  reviewedBy?: Id | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  rightsHolder!: Name;

  @IsString()
  @IsUUID()
  siteId!: Id;

  @IsEnum(AssessmentSourceType)
  sourceType!: AssessmentSourceType;

  @IsEnum(LegalReviewStatus)
  status!: LegalReviewStatus;

  @IsOptional()
  @ValidateIf((object) => object.supersedesId !== null)
  @IsString()
  @IsUUID()
  supersedesId?: Id | null;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsInt()
  @Min(0)
  version!: Version;
}