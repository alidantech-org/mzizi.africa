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
import { RelationOwnerKind } from "#/types/website/relation-owner-kind.enum.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { TraitTag } from "#/types/website/trait-tag.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Site Trait Public
 *
 * Derived from SiteTrait for read.
 */
export class SiteTraitPublicDto {

  @IsISO8601({})
  createdAt!: DateTime;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.methodId !== null)
  @IsString()
  @IsUUID()
  methodId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.observedAt !== null)
  @IsISO8601({})
  observedAt?: DateTime | null;

  @IsString()
  @IsUUID()
  ownerId!: Id;

  @IsEnum(RelationOwnerKind)
  ownerKind!: RelationOwnerKind;

  @IsOptional()
  @ValidateIf((object) => object.score !== null)
  @IsNumber({})
  @Min(0)
  @Max(1)
  score?: Confidence | null;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  tag!: TraitTag;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsInt()
  @Min(0)
  version!: Version;
}