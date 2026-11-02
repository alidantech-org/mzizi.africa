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
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Geography Entity
 */
export class GeographyEntityDto {
  @IsOptional()
  @ValidateIf((object) => object.boundaryLicense !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  boundaryLicense?: Name | null;

  @IsOptional()
  @ValidateIf((object) => object.boundaryRetrievedAt !== null)
  @IsISO8601({})
  boundaryRetrievedAt?: DateTime | null;

  @IsOptional()
  @ValidateIf((object) => object.boundarySource !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  boundarySource?: Name | null;

  @IsOptional()
  @ValidateIf((object) => object.boundarySourceReference !== null)
  @IsString()
  @MaxLength(4000)
  boundarySourceReference?: Description | null;

  @IsBoolean()
  boundaryVerified!: Flag;

  @IsOptional()
  @ValidateIf((object) => object.boundaryVersion !== null)
  @IsInt()
  @Min(0)
  boundaryVersion?: Version | null;

  @IsOptional()
  @ValidateIf((object) => object.boundaryYear !== null)
  @IsInt()
  @Min(0)
  boundaryYear?: Version | null;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  code!: BusinessCode;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  displayName!: Name;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  level!: Name;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsOptional()
  @ValidateIf((object) => object.parentId !== null)
  @IsString()
  @IsUUID()
  parentId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.parentName !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  parentName?: Name | null;

  @IsOptional()
  @ValidateIf((object) => object.validFrom !== null)
  @IsISO8601({ strict: true })
  validFrom?: Date | null;

  @IsOptional()
  @ValidateIf((object) => object.validTo !== null)
  @IsISO8601({ strict: true })
  validTo?: Date | null;
}
