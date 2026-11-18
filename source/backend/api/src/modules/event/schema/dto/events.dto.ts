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

import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One event or a recurring series of events: a public holiday, a national day, an election, a sitting, a government visit. Names, rules and dated occurrences are separate; content and media attach through the subject mechanism. (entity)
 */
export class EventsDto {
  @IsOptional()
  @ValidateIf((object) => object.basisProvisionId !== null)
  @IsString()
  @IsUUID()
  basisProvisionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.calendarId !== null)
  @IsString()
  @IsUUID()
  calendarId?: Id | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

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
  eventKindId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.organiserEntityId !== null)
  @IsString()
  @IsUUID()
  organiserEntityId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.scopeFeatureId !== null)
  @IsString()
  @IsUUID()
  scopeFeatureId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.scopeLevelKindId !== null)
  @IsString()
  @IsUUID()
  scopeLevelKindId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
