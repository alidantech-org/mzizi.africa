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
import { MembershipBasis } from "#/types/website/membership-basis.enum.ts";
import { RelationOwnerKind } from "#/types/website/relation-owner-kind.enum.ts";
import { SiteRelationKind } from "#/types/website/site-relation-kind.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Score } from "#/types/website/score.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Site Relation Public
 *
 * Derived from SiteRelation for read.
 */
export class SiteRelationPublicDto {

  @IsEnum(MembershipBasis)
  basis!: MembershipBasis;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.evidence !== null)
  @IsString()
  @MinLength(1)
  evidence?: LongText | null;

  @IsString()
  @IsUUID()
  fromId!: Id;

  @IsEnum(RelationOwnerKind)
  fromKind!: RelationOwnerKind;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(SiteRelationKind)
  relation!: SiteRelationKind;

  @IsOptional()
  @ValidateIf((object) => object.score !== null)
  @IsNumber({})
  score?: Score | null;

  @IsString()
  @IsUUID()
  toId!: Id;

  @IsEnum(RelationOwnerKind)
  toKind!: RelationOwnerKind;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsInt()
  @Min(0)
  version!: Version;
}