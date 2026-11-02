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
import type { Text } from "#/types/pipeline/text.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Dossier Summary
 */
export class DossierSummaryDto {

  @IsString()
  @IsUUID()
  id!: Id;

  @IsBoolean()
  isCurrent!: Flag;

  @IsString()
  @IsUUID()
  jurisdictionId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  jurisdictionName!: Label;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  launchStage!: Label;

  @IsOptional()
  @ValidateIf((object) => object.openQuestions !== null)
  @IsString()
  @MinLength(0)
  @MaxLength(5000)
  openQuestions?: Text | null;

  @IsOptional()
  @ValidateIf((object) => object.reviewedAt !== null)
  @IsISO8601({})
  reviewedAt?: DateTime | null;
}