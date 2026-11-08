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
import { EventStatus } from "#/types/events/event-status.enum.ts";
import { ImpactLevel } from "#/types/events/impact-level.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Event (entity)
 */
export class EventDto {

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  code!: BusinessCode;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.description !== null)
  @IsString()
  @MinLength(1)
  description?: LongText | null;

  @IsOptional()
  @ValidateIf((object) => object.endsOn !== null)
  @IsISO8601({ strict: true })
  endsOn?: Date | null;

  @IsOptional()
  @ValidateIf((object) => object.geoUnitId !== null)
  @IsString()
  @IsUUID()
  geoUnitId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.impactLevel !== null)
  @IsEnum(ImpactLevel)
  impactLevel?: ImpactLevel | null;

  @IsBoolean()
  isCurrent!: Flag;

  @IsBoolean()
  isRecurring!: Flag;

  @IsString()
  @IsUUID()
  jurisdictionId!: Id;

  @IsISO8601({ strict: true })
  startsOn!: Date;

  @IsEnum(EventStatus)
  status!: EventStatus;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title!: Name;

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