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
import { BaseEntityDto } from "#/modules/shared/dto/base-entity.dto.ts";
import { AccountStatus } from "#/types/identity/account-status.enum.ts";
import type { Issuer } from "#/types/identity/issuer.type.ts";
import type { Subject } from "#/types/identity/subject.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Account (entity)
 */
export class AccountDto {

  @IsISO8601({})
  createdAt!: DateTime;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  issuer!: Issuer;

  @IsOptional()
  @ValidateIf((object) => object.lastSeenAt !== null)
  @IsISO8601({})
  lastSeenAt?: DateTime | null;

  @IsOptional()
  @ValidateIf((object) => object.personId !== null)
  @IsString()
  @IsUUID()
  personId?: Id | null;

  @IsEnum(AccountStatus)
  status!: AccountStatus;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  subject!: Subject;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsInt()
  @Min(0)
  version!: Version;
}