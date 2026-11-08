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
import { LifeStatus } from "#/types/person/life-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { MediaMarker } from "#/types/shared/media-marker.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { WikidataId } from "#/types/shared/wikidata-id.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Person (entity)
 */
export class PersonDto {

  @IsOptional()
  @ValidateIf((object) => object.birthDate !== null)
  @IsISO8601({ strict: true })
  birthDate?: Date | null;

  @IsOptional()
  @ValidateIf((object) => object.birthDatePrecision !== null)
  @IsEnum(DatePrecision)
  birthDatePrecision?: DatePrecision | null;

  @IsOptional()
  @ValidateIf((object) => object.birthPlaceId !== null)
  @IsString()
  @IsUUID()
  birthPlaceId?: Id | null;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  code!: BusinessCode;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.deathDate !== null)
  @IsISO8601({ strict: true })
  deathDate?: Date | null;

  @IsOptional()
  @ValidateIf((object) => object.deathDatePrecision !== null)
  @IsEnum(DatePrecision)
  deathDatePrecision?: DatePrecision | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  displayName!: Name;

  @IsOptional()
  @ValidateIf((object) => object.familyName !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  familyName?: Name | null;

  @IsOptional()
  @ValidateIf((object) => object.givenName !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  givenName?: Name | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsBoolean()
  isCurrent!: Flag;

  @IsEnum(LifeStatus)
  lifeStatus!: LifeStatus;

  @IsOptional()
  @ValidateIf((object) => object.portraitMarker !== null)
  @IsEnum(MediaMarker)
  portraitMarker?: MediaMarker | null;

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

  @IsOptional()
  @ValidateIf((object) => object.wikidataId !== null)
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  wikidataId?: WikidataId | null;
}