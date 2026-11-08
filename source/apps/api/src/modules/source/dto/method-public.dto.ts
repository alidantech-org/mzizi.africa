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
import { ProvenanceMethod } from "#/types/shared/provenance-method.enum.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { ToolName } from "#/types/source/tool-name.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Method Public
 *
 * Derived from Method for read.
 */
export class MethodPublicDto {

  @IsISO8601({})
  createdAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.description !== null)
  @IsString()
  @MaxLength(4000)
  description?: Description | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(ProvenanceMethod)
  kind!: ProvenanceMethod;

  @IsOptional()
  @ValidateIf((object) => object.model !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  model?: ToolName | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsOptional()
  @ValidateIf((object) => object.tool !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  tool?: ToolName | null;

  @IsOptional()
  @ValidateIf((object) => object.toolVersion !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  toolVersion?: ToolName | null;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsInt()
  @Min(0)
  version!: Version;
}