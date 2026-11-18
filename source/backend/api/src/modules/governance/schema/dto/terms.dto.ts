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

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A fixed period for which offices are filled: a presidential term, a parliament, a county assembly. Elections, by-elections, mandates and sittings belong to a term. (entity)
 */
export class TermsDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsString()
  @IsUUID()
  countryId!: Id;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.endsOn !== null)
  @IsISO8601({ strict: true })
  endsOn?: CalendarDate | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.institutionId !== null)
  @IsString()
  @IsUUID()
  institutionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.ordinal !== null)
  @IsInt()
  @Min(1)
  ordinal?: PositiveInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsISO8601({ strict: true })
  @Satisfies<TermsDto>(
    (object) =>
      object.startsOn == null || object.endsOn == null || object.startsOn <= object.endsOn,
    {
      message: "Term Dates Are Ordered",
    },
  )
  startsOn!: CalendarDate;

  @IsString()
  @IsUUID()
  termKindId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.unitFeatureId !== null)
  @IsString()
  @IsUUID()
  unitFeatureId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
