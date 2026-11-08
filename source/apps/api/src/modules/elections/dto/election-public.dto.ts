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
import { ElectionStatus } from "#/types/elections/election-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Election Public
 *
 * Derived from Election for read.
 */
export class ElectionPublicDto {

  @IsOptional()
  @ValidateIf((object) => object.administeringInstitutionId !== null)
  @IsString()
  @IsUUID()
  administeringInstitutionId?: Id | null;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  code!: BusinessCode;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.geoUnitId !== null)
  @IsString()
  @IsUUID()
  geoUnitId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.heldDate !== null)
  @IsISO8601({ strict: true })
  heldDate?: Date | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsBoolean()
  isCurrent!: Flag;

  @IsString()
  @IsUUID()
  jurisdictionId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.legalBasisId !== null)
  @IsString()
  @IsUUID()
  legalBasisId?: Id | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsOptional()
  @ValidateIf((object) => object.scheduledDate !== null)
  @IsISO8601({ strict: true })
  scheduledDate?: Date | null;

  @IsEnum(ElectionStatus)
  status!: ElectionStatus;

  @IsString()
  @IsUUID()
  typeId!: Id;

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