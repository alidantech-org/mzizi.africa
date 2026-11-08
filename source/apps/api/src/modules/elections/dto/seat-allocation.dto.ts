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
import { ElectionDto } from "#/modules/elections/dto/election.dto.ts";
import { HistoricalEntityDto } from "#/modules/shared/dto/historical-entity.dto.ts";
import { AllocationKind } from "#/types/elections/allocation-kind.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Count } from "#/types/shared/count.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Seat Allocation (entity)
 */
export class SeatAllocationDto {

  @IsOptional()
  @ValidateIf((object) => object.allocatedOn !== null)
  @IsISO8601({ strict: true })
  allocatedOn?: Date | null;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.declaringInstitutionId !== null)
  @IsString()
  @IsUUID()
  declaringInstitutionId?: Id | null;

  @IsString()
  @IsUUID()
  electionId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.geoUnitId !== null)
  @IsString()
  @IsUUID()
  geoUnitId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsBoolean()
  isCurrent!: Flag;

  @IsEnum(AllocationKind)
  kind!: AllocationKind;

  @IsOptional()
  @ValidateIf((object) => object.listPosition !== null)
  @IsInt()
  @Min(0)
  listPosition?: Count | null;

  @IsString()
  @IsUUID()
  partyId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.personId !== null)
  @IsString()
  @IsUUID()
  personId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.seatId !== null)
  @IsString()
  @IsUUID()
  seatId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.seatsEntitled !== null)
  @IsInt()
  @Min(0)
  seatsEntitled?: Count | null;

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