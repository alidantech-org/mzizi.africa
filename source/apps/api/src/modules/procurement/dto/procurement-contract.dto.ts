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
import { TenderDto } from "#/modules/procurement/dto/tender.dto.ts";
import { HistoricalEntityDto } from "#/modules/shared/dto/historical-entity.dto.ts";
import { ContractStatus } from "#/types/procurement/contract-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Amount } from "#/types/shared/amount.type.ts";
import type { CurrencyCode } from "#/types/shared/currency-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongCode } from "#/types/shared/long-code.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Procurement Contract (entity)
 */
export class ProcurementContractDto {

  @IsString()
  @IsUUID()
  awardedEntityId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.awardedOn !== null)
  @IsISO8601({ strict: true })
  awardedOn?: Date | null;

  @IsString()
  @MinLength(2)
  @MaxLength(300)
  code!: LongCode;

  @IsOptional()
  @ValidateIf((object) => object.contractingOfficeId !== null)
  @IsString()
  @IsUUID()
  contractingOfficeId?: Id | null;

  @IsString()
  @IsUUID()
  contractingUnitId!: Id;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsString()
  @MinLength(3)
  @MaxLength(3)
  currencyCode!: CurrencyCode;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsBoolean()
  isCurrent!: Flag;

  @IsEnum(ContractStatus)
  status!: ContractStatus;

  @IsString()
  @IsUUID()
  tenderId!: Id;

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

  @IsNumber({})
  value!: Amount;

  @IsInt()
  @Min(0)
  version!: Version;
}