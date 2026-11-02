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
import { MembershipBasis } from "#/types/website/membership-basis.enum.ts";
import { MembershipRole } from "#/types/website/membership-role.enum.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Site Member (entity)
 */
export class SiteMemberDto {

  @IsEnum(MembershipBasis)
  basis!: MembershipBasis;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsString()
  @IsUUID()
  familyId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.methodId !== null)
  @IsString()
  @IsUUID()
  methodId?: Id | null;

  @IsEnum(MembershipRole)
  role!: MembershipRole;

  @IsOptional()
  @ValidateIf((object) => object.score !== null)
  @IsNumber({})
  @Min(0)
  @Max(1)
  score?: Confidence | null;

  @IsString()
  @IsUUID()
  siteId!: Id;

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