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
import { ExtractionDiagnosticDto } from "#/modules/exchange/dto/extraction-diagnostic.dto.ts";
import { ExtractionSegmentDto } from "#/modules/exchange/dto/extraction-segment.dto.ts";
import { FileArtifactRefDto } from "#/modules/exchange/dto/file-artifact-ref.dto.ts";
import { ExtractionStatus } from "#/types/exchange/extraction-status.enum.ts";
import type { ContractVersion } from "#/types/exchange/contract-version.type.ts";
import type { Sha256 } from "#/types/exchange/sha256.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Extraction Result
 */
export class ExtractionResultDto {

  @IsDefined()
  @ValidateNested()
  @Type(() => FileArtifactRefDto)
  artifact!: FileArtifactRefDto;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ExtractionDiagnosticDto)
  diagnostics!: ExtractionDiagnosticDto[];

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  extractor!: Label;

  @IsString()
  @MinLength(1)
  @MaxLength(40)
  extractorVersion!: ContractVersion;

  @IsISO8601({})
  finishedAt!: DateTime;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @MinLength(64)
  @MaxLength(64)
  inputHash!: Sha256;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  profile?: Label;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ExtractionSegmentDto)
  segments!: ExtractionSegmentDto[];

  @IsISO8601({})
  startedAt!: DateTime;

  @IsEnum(ExtractionStatus)
  status!: ExtractionStatus;

  @IsOptional()
  @IsString()
  @IsUUID()
  structureVersionId?: Id;

  @IsOptional()
  @IsString()
  @IsUUID()
  supersedesResultId?: Id;
}