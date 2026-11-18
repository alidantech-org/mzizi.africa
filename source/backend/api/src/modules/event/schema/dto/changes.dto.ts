import {
  IsInt,
  IsISO8601,
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
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One reschedule, postponement, adjournment, cancellation or confirmation of an occurrence, with the reason, who decided it and under which law. History is the list of changes. (entity)
 */
export class ChangesDto {
  @IsOptional()
  @ValidateIf((object) => object.authorityEntityId !== null)
  @IsString()
  @IsUUID()
  authorityEntityId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.basisProvisionId !== null)
  @IsString()
  @IsUUID()
  basisProvisionId?: Id | null;

  @IsString()
  @IsUUID()
  changeKindId!: Id;

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
  @ValidateIf((object) => object.decidedOn !== null)
  @IsISO8601({ strict: true })
  decidedOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.explanation !== null)
  @IsString()
  @MaxLength(4000)
  explanation?: Description | null;

  @IsOptional()
  @ValidateIf((object) => object.fromOn !== null)
  @IsISO8601({ strict: true })
  fromOn?: CalendarDate | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  occurrenceId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.reasonId !== null)
  @IsString()
  @IsUUID()
  reasonId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.replacementOccurrenceId !== null)
  @IsString()
  @IsUUID()
  replacementOccurrenceId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.toOn !== null)
  @IsISO8601({ strict: true })
  toOn?: CalendarDate | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
