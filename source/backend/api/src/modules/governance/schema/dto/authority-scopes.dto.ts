
import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One institution or office authority over a required Geography unit for an effective period. (entity)
 */
export class AuthorityScopesDto {

  @IsString()
  @IsUUID()
  authorityKindId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.countryId !== null)
  @IsString()
  @IsUUID()
  countryId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.institutionId !== null)
  @IsString()
  @IsUUID()
  institutionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.officeId !== null)
  @IsString()
  @IsUUID()
  officeId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsString()
  @IsUUID()
  unitFeatureId!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.validFrom !== null)
  @IsISO8601({ strict: true })
  @Satisfies<AuthorityScopesDto>((object) => object.validFrom == null || object.validUntil == null || object.validFrom < object.validUntil, {
    message: "Validity Window Is Ordered",
  })
  validFrom?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.validUntil !== null)
  @IsISO8601({ strict: true })
  validUntil?: CalendarDate | null;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}