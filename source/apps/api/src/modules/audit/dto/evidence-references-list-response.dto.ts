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
import { EvidenceReferencePublicDto } from "#/modules/audit/dto/evidence-reference-public.dto.ts";
import { PaginatedResponseDto } from "#/modules/shared/dto/paginated-response.dto.ts";
import { PaginationMetaDto } from "#/modules/shared/dto/pagination-meta.dto.ts";

/**
 * Evidence References List Response
 */
export class EvidenceReferencesListResponseDto {

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => EvidenceReferencePublicDto)
  evidenceReferences!: EvidenceReferencePublicDto[];

  @IsDefined()
  @ValidateNested()
  @Type(() => PaginationMetaDto)
  meta!: PaginationMetaDto;
}