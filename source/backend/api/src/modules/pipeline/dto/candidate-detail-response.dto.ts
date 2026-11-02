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
import { CandidateIssueDto } from "#/modules/pipeline/dto/candidate-issue.dto.ts";
import { CandidateSummaryDto } from "#/modules/pipeline/dto/candidate-summary.dto.ts";
import type { JsonText } from "#/types/pipeline/json-text.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";

/**
 * Candidate Detail Response
 */
export class CandidateDetailResponseDto {

  @IsDefined()
  @ValidateNested()
  @Type(() => CandidateSummaryDto)
  candidate!: CandidateSummaryDto;

  @IsOptional()
  @ValidateIf((object) => object.captureId !== null)
  @IsString()
  @IsUUID()
  captureId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.current !== null)
  @IsString()
  @MinLength(2)
  current?: JsonText | null;

  @IsOptional()
  @ValidateIf((object) => object.documentId !== null)
  @IsString()
  @IsUUID()
  documentId?: Id | null;

  @IsString()
  @IsUUID()
  extractionResultId!: Id;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CandidateIssueDto)
  issues!: CandidateIssueDto[];

  @IsOptional()
  @ValidateIf((object) => object.locator !== null)
  @IsString()
  @MinLength(2)
  locator?: JsonText | null;

  @IsString()
  @MinLength(2)
  payload!: JsonText;

  @IsOptional()
  @ValidateIf((object) => object.segmentKey !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  segmentKey?: Label | null;

  @IsOptional()
  @ValidateIf((object) => object.siteId !== null)
  @IsString()
  @IsUUID()
  siteId?: Id | null;
}