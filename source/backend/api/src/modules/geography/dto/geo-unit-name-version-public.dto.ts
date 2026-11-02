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
import { GeoUnitDto } from "#/modules/geography/dto/geo-unit.dto.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { ProvenanceMethod } from "#/types/shared/provenance-method.enum.ts";
import { VerificationState } from "#/types/shared/verification-state.enum.ts";
import type { LanguageTag } from "#/types/geography/language-tag.type.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Geo Unit Name Version Public
 *
 * Derived from GeoUnitNameVersion for read.
 */
export class GeoUnitNameVersionPublicDto {

  @IsOptional()
  @ValidateIf((object) => object.artifactChecksum !== null)
  @IsString()
  @MinLength(64)
  @MaxLength(64)
  artifactChecksum?: Checksum | null;

  @IsOptional()
  @ValidateIf((object) => object.artifactId !== null)
  @IsString()
  @IsUUID()
  artifactId?: Id | null;

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
  id!: Id;

  @IsBoolean()
  isCurrent!: Flag;

  @IsOptional()
  @ValidateIf((object) => object.language !== null)
  @IsString()
  @MinLength(2)
  @MaxLength(35)
  language?: LanguageTag | null;

  @IsOptional()
  @ValidateIf((object) => object.licence !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  licence?: Name | null;

  @IsEnum(ProvenanceMethod)
  method!: ProvenanceMethod;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsOptional()
  @ValidateIf((object) => object.retrievedAt !== null)
  @IsISO8601({})
  retrievedAt?: DateTime | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  sourceName!: Name;

  @IsOptional()
  @ValidateIf((object) => object.sourceReference !== null)
  @IsString()
  @MaxLength(4000)
  sourceReference?: Description | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceUrl !== null)
  @IsString()
  @IsUrl()
  @MaxLength(1000)
  sourceUrl?: Url | null;

  @IsOptional()
  @ValidateIf((object) => object.toolOrModel !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  toolOrModel?: Name | null;

  @IsString()
  @IsUUID()
  unitId!: Id;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.validFrom !== null)
  @IsISO8601({ strict: true })
  validFrom?: Date | null;

  @IsOptional()
  @ValidateIf((object) => object.validFromPrecision !== null)
  @IsEnum(DatePrecision)
  validFromPrecision?: DatePrecision | null;

  @IsOptional()
  @ValidateIf((object) => object.validTo !== null)
  @IsISO8601({ strict: true })
  validTo?: Date | null;

  @IsOptional()
  @ValidateIf((object) => object.validToPrecision !== null)
  @IsEnum(DatePrecision)
  validToPrecision?: DatePrecision | null;

  @IsEnum(VerificationState)
  verificationState!: VerificationState;

  @IsInt()
  @Min(0)
  version!: Version;
}