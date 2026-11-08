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
import { CandidateStatus } from "#/types/exchange/candidate-status.enum.ts";
import { ProvenanceMethod } from "#/types/shared/provenance-method.enum.ts";
import type { JsonDocument } from "#/types/exchange/json-document.type.ts";
import type { Sha256 } from "#/types/exchange/sha256.type.ts";
import type { Target } from "#/types/exchange/target.type.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";

/**
 * Candidate Record
 */
export class CandidateRecordDto {

  @IsOptional()
  @IsNumber({})
  @Min(0)
  @Max(1)
  confidence?: Confidence;

  @IsString()
  @IsUUID()
  extractionResultId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @IsString()
  @MinLength(2)
  locator?: JsonDocument;

  @IsEnum(ProvenanceMethod)
  method!: ProvenanceMethod;

  @IsString()
  @MinLength(64)
  @MaxLength(64)
  naturalKeyHash!: Sha256;

  @IsString()
  @MinLength(2)
  payload!: JsonDocument;

  @IsOptional()
  @IsString()
  @IsUUID()
  resolvedTargetId?: Id;

  @IsString()
  @IsUUID()
  runId!: Id;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  segmentKey?: Label;

  @IsEnum(CandidateStatus)
  status!: CandidateStatus;

  @IsOptional()
  @IsString()
  @IsUUID()
  supersedesCandidateId?: Id;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  target!: Target;
}