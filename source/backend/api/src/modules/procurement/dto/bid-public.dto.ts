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
import { TenderDto } from "#/modules/procurement/dto/tender.dto.ts";
import { BidStatus } from "#/types/procurement/bid-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { ProvenanceMethod } from "#/types/shared/provenance-method.enum.ts";
import { VerificationState } from "#/types/shared/verification-state.enum.ts";
import type { Amount } from "#/types/shared/amount.type.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { CurrencyCode } from "#/types/shared/currency-code.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Bid Public
 *
 * Derived from Bid for read.
 */
export class BidPublicDto {

  @IsNumber({})
  amount!: Amount;

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

  @IsString()
  @IsUUID()
  bidderEntityId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.confidence !== null)
  @IsNumber({})
  @Min(0)
  @Max(1)
  confidence?: Confidence | null;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsString()
  @MinLength(3)
  @MaxLength(3)
  currencyCode!: CurrencyCode;

  @IsOptional()
  @ValidateIf((object) => object.evaluationNote !== null)
  @IsString()
  @MaxLength(4000)
  evaluationNote?: Description | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.isCompliant !== null)
  @IsBoolean()
  isCompliant?: Flag | null;

  @IsBoolean()
  isCurrent!: Flag;

  @IsOptional()
  @ValidateIf((object) => object.licence !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  licence?: Name | null;

  @IsEnum(ProvenanceMethod)
  method!: ProvenanceMethod;

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

  @IsEnum(BidStatus)
  status!: BidStatus;

  @IsISO8601({ strict: true })
  submittedOn!: Date;

  @IsString()
  @IsUUID()
  tenderId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.toolOrModel !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  toolOrModel?: Name | null;

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