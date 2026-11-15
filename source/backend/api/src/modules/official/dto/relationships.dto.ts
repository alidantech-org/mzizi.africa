
import {
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/dto/validators/satisfies.ts";
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { Percentage } from "#/modules/shared/type/percentage.type.ts";
import type { PositiveInteger } from "#/modules/shared/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/type/instant.type.ts";

/**
 * One directed typed relationship between exactly two Official identities, optionally with an ownership share. (entity)
 *
 * Invariant "HasExactlyOneFromIdentity" has no simple form, so it isn't validated here.
 *
 * Invariant "HasExactlyOneToIdentity" has no simple form, so it isn't validated here.
 */
export class RelationshipsDto {

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.fromEntityId !== null)
  @IsString()
  @IsUUID()
  @Satisfies<RelationshipsDto>((object) => object.fromEntityId !== object.toEntityId && object.fromIndividualId !== object.toIndividualId, {
    message: "Does Not Link Identity To Itself",
  })
  fromEntityId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.fromIndividualId !== null)
  @IsString()
  @IsUUID()
  fromIndividualId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  kindId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.sharePercentage !== null)
  @IsNumber({})
  @Min(0)
  @Max(100)
  sharePercentage?: Percentage | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.toEntityId !== null)
  @IsString()
  @IsUUID()
  toEntityId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.toIndividualId !== null)
  @IsString()
  @IsUUID()
  toIndividualId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.validFrom !== null)
  @IsISO8601({ strict: true })
  @Satisfies<RelationshipsDto>((object) => object.validFrom == null || object.validUntil == null || object.validFrom < object.validUntil, {
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