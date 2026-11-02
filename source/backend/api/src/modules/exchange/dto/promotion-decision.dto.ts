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
import { PromotionOutcome } from "#/types/exchange/promotion-outcome.enum.ts";
import { VerificationState } from "#/types/shared/verification-state.enum.ts";
import type { Target } from "#/types/exchange/target.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Message } from "#/types/shared/message.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Promotion Decision
 */
export class PromotionDecisionDto {

  @IsString()
  @IsUUID()
  auditDecisionId!: Id;

  @IsString()
  @IsUUID()
  candidateId!: Id;

  @IsISO8601({})
  decidedAt!: DateTime;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(PromotionOutcome)
  outcome!: PromotionOutcome;

  @IsOptional()
  @IsString()
  @IsUUID()
  previousTargetId?: Id;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  reasons!: Message[];

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  target!: Target;

  @IsOptional()
  @IsString()
  @IsUUID()
  targetId?: Id;

  @IsEnum(VerificationState)
  verificationState!: VerificationState;
}