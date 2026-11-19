import {
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Something a leader said they would do, with where and when, what was promised and its checked status. 'No record found' is a status backed by source coverage, never an empty cell. (entity)
 *
 * Invariant "HasExactlyOneMaker" has no simple form, so it isn't validated here.
 */
export class PromisesDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.dueOn !== null)
  @IsISO8601({ strict: true })
  dueOn?: CalendarDate | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsISO8601({ strict: true })
  madeOn!: CalendarDate;

  @IsOptional()
  @ValidateIf((object) => object.makerHolderId !== null)
  @IsString()
  @IsUUID()
  makerHolderId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.makerIndividualId !== null)
  @IsString()
  @IsUUID()
  makerIndividualId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.occurrenceId !== null)
  @IsString()
  @IsUUID()
  occurrenceId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.officeId !== null)
  @IsString()
  @IsUUID()
  officeId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.placeFeatureId !== null)
  @IsString()
  @IsUUID()
  placeFeatureId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.quantity !== null)
  @IsNumber({})
  quantity?: Number | null;

  @IsOptional()
  @ValidateIf((object) => object.sittingId !== null)
  @IsString()
  @IsUUID()
  sittingId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.speechId !== null)
  @IsString()
  @IsUUID()
  speechId?: Id | null;

  @IsString()
  @MaxLength(4000)
  statement!: Description;

  @IsISO8601({ strict: true })
  statusAsOf!: CalendarDate;

  @IsString()
  @IsUUID()
  statusId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.topicId !== null)
  @IsString()
  @IsUUID()
  topicId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.unitId !== null)
  @IsString()
  @IsUUID()
  unitId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
