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
import { BudgetaryUnitDto } from "#/modules/finance/dto/budgetary-unit.dto.ts";
import { HistoricalEntityDto } from "#/modules/shared/dto/historical-entity.dto.ts";
import { FundRestriction } from "#/types/finance/fund-restriction.enum.ts";
import { TransferStatus } from "#/types/finance/transfer-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Amount } from "#/types/shared/amount.type.ts";
import type { CurrencyCode } from "#/types/shared/currency-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Transfer (entity)
 */
export class TransferDto {

  @IsNumber({})
  amount!: Amount;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsString()
  @MinLength(3)
  @MaxLength(3)
  currencyCode!: CurrencyCode;

  @IsString()
  @IsUUID()
  fiscalYearId!: Id;

  @IsString()
  @IsUUID()
  fromUnitId!: Id;

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

  @IsEnum(FundRestriction)
  restriction!: FundRestriction;

  @IsEnum(TransferStatus)
  status!: TransferStatus;

  @IsString()
  @IsUUID()
  toUnitId!: Id;

  @IsString()
  @IsUUID()
  transferTypeId!: Id;

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