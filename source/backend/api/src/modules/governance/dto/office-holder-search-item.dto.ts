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
import { HolderStatus } from "#/types/governance/holder-status.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Office Holder Search Item
 */
export class OfficeHolderSearchItemDto {

  @IsString()
  @IsUUID()
  holderId!: Id;

  @IsString()
  @IsUUID()
  institutionId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  institutionName!: Name;

  @IsBoolean()
  isCurrent!: Flag;

  @IsString()
  @IsUUID()
  officeId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  officeName!: Name;

  @IsOptional()
  @ValidateIf((object) => object.partyName !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  partyName?: Name | null;

  @IsString()
  @IsUUID()
  personId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  personName!: Name;

  @IsOptional()
  @ValidateIf((object) => object.placeName !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  placeName?: Name | null;

  @IsEnum(HolderStatus)
  status!: HolderStatus;

  @IsOptional()
  @ValidateIf((object) => object.validFrom !== null)
  @IsISO8601({ strict: true })
  validFrom?: Date | null;

  @IsOptional()
  @ValidateIf((object) => object.validTo !== null)
  @IsISO8601({ strict: true })
  validTo?: Date | null;
}