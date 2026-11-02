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
import { PlaceKind } from "#/types/place/place-kind.enum.ts";
import { PlaceStatus } from "#/types/place/place-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Latitude } from "#/types/place/latitude.type.ts";
import type { Longitude } from "#/types/place/longitude.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Place (entity)
 */
export class PlaceDto {

  @IsOptional()
  @ValidateIf((object) => object.addressText !== null)
  @IsString()
  @MinLength(1)
  addressText?: LongText | null;

  @IsOptional()
  @ValidateIf((object) => object.availableFrom !== null)
  @IsISO8601({ strict: true })
  availableFrom?: Date | null;

  @IsOptional()
  @ValidateIf((object) => object.buildingTypeId !== null)
  @IsString()
  @IsUUID()
  buildingTypeId?: Id | null;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsBoolean()
  isCurrent!: Flag;

  @IsEnum(PlaceKind)
  kind!: PlaceKind;

  @IsOptional()
  @ValidateIf((object) => object.latitude !== null)
  @IsNumber({})
  latitude?: Latitude | null;

  @IsOptional()
  @ValidateIf((object) => object.locatedInUnitId !== null)
  @IsString()
  @IsUUID()
  locatedInUnitId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.longitude !== null)
  @IsNumber({})
  longitude?: Longitude | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsOptional()
  @ValidateIf((object) => object.parentId !== null)
  @IsString()
  @IsUUID()
  parentId?: Id | null;

  @IsEnum(PlaceStatus)
  status!: PlaceStatus;

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