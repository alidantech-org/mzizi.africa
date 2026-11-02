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
import { EvaluationKind } from "#/types/exchange/evaluation-kind.enum.ts";
import type { ContractVersion } from "#/types/exchange/contract-version.type.ts";
import type { JsonDocument } from "#/types/exchange/json-document.type.ts";
import type { Sha256 } from "#/types/exchange/sha256.type.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Intelligence Evaluation
 */
export class IntelligenceEvaluationDto {

  @IsOptional()
  @IsNumber({})
  @Min(0)
  @Max(1)
  confidence?: Confidence;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsOptional()
  @IsString()
  @MinLength(1)
  explanation?: LongText;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @MinLength(64)
  @MaxLength(64)
  inputHash!: Sha256;

  @IsEnum(EvaluationKind)
  kind!: EvaluationKind;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  model?: Label;

  @IsString()
  @MinLength(2)
  output!: JsonDocument;

  @IsOptional()
  @IsString()
  @IsUUID()
  subjectCandidateId?: Id;

  @IsOptional()
  @IsString()
  @IsUUID()
  subjectResultId?: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  tool!: Label;

  @IsString()
  @MinLength(1)
  @MaxLength(40)
  toolVersion!: ContractVersion;
}