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
import { LoanStatus } from "#/types/debt/loan-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { TermMonths } from "#/types/debt/term-months.type.ts";
import type { Amount } from "#/types/shared/amount.type.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { CurrencyCode } from "#/types/shared/currency-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Rate } from "#/types/shared/rate.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Loan (entity)
 */
export class LoanDto {

  @IsString()
  @IsUUID()
  borrowerUnitId!: Id;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  code!: BusinessCode;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsString()
  @MinLength(3)
  @MaxLength(3)
  currencyCode!: CurrencyCode;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.interestRate !== null)
  @IsNumber({})
  interestRate?: Rate | null;

  @IsBoolean()
  isCurrent!: Flag;

  @IsOptional()
  @ValidateIf((object) => object.legalBasisId !== null)
  @IsString()
  @IsUUID()
  legalBasisId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.lenderEntityId !== null)
  @IsString()
  @IsUUID()
  lenderEntityId?: Id | null;

  @IsNumber({})
  principalAmount!: Amount;

  @IsEnum(LoanStatus)
  status!: LoanStatus;

  @IsOptional()
  @ValidateIf((object) => object.termMonths !== null)
  @IsInt()
  @Min(0)
  termMonths?: TermMonths | null;

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