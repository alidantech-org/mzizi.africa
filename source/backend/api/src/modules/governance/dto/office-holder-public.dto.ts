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
import { OfficeDto } from "#/modules/governance/dto/office.dto.ts";
import { DepartureReason } from "#/types/governance/departure-reason.enum.ts";
import { HolderStatus } from "#/types/governance/holder-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Count } from "#/types/shared/count.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Office Holder Public
 *
 * Derived from OfficeHolder for read.
 */
export class OfficeHolderPublicDto {

  @IsISO8601({})
  createdAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.departureReason !== null)
  @IsEnum(DepartureReason)
  departureReason?: DepartureReason | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsBoolean()
  isCurrent!: Flag;

  @IsOptional()
  @ValidateIf((object) => object.legalBasisId !== null)
  @IsString()
  @IsUUID()
  legalBasisId?: Id | null;

  @IsString()
  @IsUUID()
  officeId!: Id;

  @IsString()
  @IsUUID()
  personId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.selectionProcedureId !== null)
  @IsString()
  @IsUUID()
  selectionProcedureId?: Id | null;

  @IsEnum(HolderStatus)
  status!: HolderStatus;

  @IsOptional()
  @ValidateIf((object) => object.termNumber !== null)
  @IsInt()
  @Min(0)
  termNumber?: Count | null;

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