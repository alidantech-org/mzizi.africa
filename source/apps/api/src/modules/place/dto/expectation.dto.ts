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
import { HistoricalEntityDto } from "#/modules/shared/dto/historical-entity.dto.ts";
import { ExpectationBasis } from "#/types/place/expectation-basis.enum.ts";
import { ExpectationStatus } from "#/types/place/expectation-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Count } from "#/types/shared/count.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Expectation (entity)
 */
export class ExpectationDto {

  @IsEnum(ExpectationBasis)
  basis!: ExpectationBasis;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.facilityTypeId !== null)
  @IsString()
  @IsUUID()
  facilityTypeId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsBoolean()
  isCurrent!: Flag;

  @IsOptional()
  @ValidateIf((object) => object.maxCount !== null)
  @IsInt()
  @Min(0)
  maxCount?: Count | null;

  @IsInt()
  @Min(0)
  minCount!: Count;

  @IsOptional()
  @ValidateIf((object) => object.resolvedOccupancyId !== null)
  @IsString()
  @IsUUID()
  resolvedOccupancyId?: Id | null;

  @IsString()
  @IsUUID()
  roleId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.scopeGeoUnitId !== null)
  @IsString()
  @IsUUID()
  scopeGeoUnitId?: Id | null;

  @IsEnum(ExpectationStatus)
  status!: ExpectationStatus;

  @IsString()
  @IsUUID()
  subjectId!: Id;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  subjectKind!: TargetKind;

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