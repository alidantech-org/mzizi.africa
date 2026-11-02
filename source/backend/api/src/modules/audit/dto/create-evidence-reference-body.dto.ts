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
import type { MediaType } from "#/types/audit/media-type.type.ts";
import type { SizeBytes } from "#/types/audit/size-bytes.type.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";

/**
 * Create Evidence Reference Body
 */
export class CreateEvidenceReferenceBodyDto {

  @IsString()
  @MinLength(64)
  @MaxLength(64)
  artifactChecksum!: Checksum;

  @IsString()
  @IsUUID()
  artifactId!: Id;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  mediaType!: MediaType;

  @IsOptional()
  @ValidateIf((object) => object.note !== null)
  @IsString()
  @MaxLength(4000)
  note?: Description | null;

  @IsInt()
  @Min(0)
  sizeBytes!: SizeBytes;

  @IsString()
  @IsUUID()
  targetId!: Id;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  targetKind!: TargetKind;
}