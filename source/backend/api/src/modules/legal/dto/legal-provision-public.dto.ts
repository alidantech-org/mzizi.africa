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
import { LegalInstrumentDto } from "#/modules/legal/dto/legal-instrument.dto.ts";
import { ProvisionKind } from "#/types/legal/provision-kind.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Citation } from "#/types/legal/citation.type.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Count } from "#/types/shared/count.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Legal Provision Public
 *
 * Derived from LegalProvision for read.
 */
export class LegalProvisionPublicDto {

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  citation!: Citation;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  code!: BusinessCode;

  @IsOptional()
  @ValidateIf((object) => object.content !== null)
  @IsString()
  @MinLength(1)
  content?: LongText | null;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.heading !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  heading?: Name | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  instrumentId!: Id;

  @IsBoolean()
  isCurrent!: Flag;

  @IsEnum(ProvisionKind)
  kind!: ProvisionKind;

  @IsOptional()
  @ValidateIf((object) => object.parentId !== null)
  @IsString()
  @IsUUID()
  parentId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.previousVersionId !== null)
  @IsString()
  @IsUUID()
  previousVersionId?: Id | null;

  @IsInt()
  @Min(0)
  sortOrder!: Count;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.validFrom !== null)
  @IsISO8601({ strict: true })
  validFrom?: Date | null;

  @IsOptional()
  @ValidateIf((object) => object.validFromPrecision !== null)
  @IsEnum(DatePrecision)
  validFromPrecision?: DatePrecision | null;

  @IsOptional()
  @ValidateIf((object) => object.validTo !== null)
  @IsISO8601({ strict: true })
  validTo?: Date | null;

  @IsOptional()
  @ValidateIf((object) => object.validToPrecision !== null)
  @IsEnum(DatePrecision)
  validToPrecision?: DatePrecision | null;

  @IsInt()
  @Min(0)
  version!: Version;
}