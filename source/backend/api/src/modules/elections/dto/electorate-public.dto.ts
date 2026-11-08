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
import { ResultStatus } from "#/types/elections/result-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { EvidenceForm } from "#/types/elections/evidence-form.type.ts";
import type { RegisterVersion } from "#/types/elections/register-version.type.ts";
import type { Votes } from "#/types/elections/votes.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Electorate Public
 *
 * Derived from Electorate for read.
 */
export class ElectoratePublicDto {

  @IsISO8601({})
  createdAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.declaredAt !== null)
  @IsISO8601({})
  declaredAt?: DateTime | null;

  @IsOptional()
  @ValidateIf((object) => object.declaringInstitutionId !== null)
  @IsString()
  @IsUUID()
  declaringInstitutionId?: Id | null;

  @IsString()
  @IsUUID()
  electionId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.evidenceForm !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  evidenceForm?: EvidenceForm | null;

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

  @IsOptional()
  @ValidateIf((object) => object.registerVersion !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  registerVersion?: RegisterVersion | null;

  @IsOptional()
  @ValidateIf((object) => object.registeredVoters !== null)
  @IsInt()
  @Min(0)
  registeredVoters?: Votes | null;

  @IsOptional()
  @ValidateIf((object) => object.rejectedVotes !== null)
  @IsInt()
  @Min(0)
  rejectedVotes?: Votes | null;

  @IsString()
  @IsUUID()
  resultLevelId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.resultStatus !== null)
  @IsEnum(ResultStatus)
  resultStatus?: ResultStatus | null;

  @IsOptional()
  @ValidateIf((object) => object.seatId !== null)
  @IsString()
  @IsUUID()
  seatId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.spoiltVotes !== null)
  @IsInt()
  @Min(0)
  spoiltVotes?: Votes | null;

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

  @IsOptional()
  @ValidateIf((object) => object.validVotes !== null)
  @IsInt()
  @Min(0)
  validVotes?: Votes | null;

  @IsInt()
  @Min(0)
  version!: Version;

  @IsOptional()
  @ValidateIf((object) => object.votesCast !== null)
  @IsInt()
  @Min(0)
  votesCast?: Votes | null;
}