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
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";

/**
 * Document Summary
 */
export class DocumentSummaryDto {

  @IsNumber({})
  @Min(0)
  @Max(1000)
  captures!: PaginationNumber;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  kind!: Label;

  @IsOptional()
  @ValidateIf((object) => object.language !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  language?: Label | null;

  @IsOptional()
  @ValidateIf((object) => object.publishedOn !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  publishedOn?: Label | null;

  @IsString()
  @MinLength(0)
  @MaxLength(5000)
  publisher!: Text;

  @IsString()
  @MinLength(0)
  @MaxLength(5000)
  title!: Text;

  @IsOptional()
  @ValidateIf((object) => object.url !== null)
  @IsString()
  @MinLength(0)
  @MaxLength(5000)
  url?: Text | null;
}