import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import { IdentityKind } from "#/modules/shared/schema/enum/identity-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A person in public life. Display names are `identity.names`; name parts are `official.parts`. (entity)
 */
export class IndividualsDto {
  @IsOptional()
  @ValidateIf((object) => object.birthDate !== null)
  @IsISO8601({ strict: true })
  @Satisfies<IndividualsDto>(
    (object) =>
      object.birthDate == null || object.deathDate == null || object.birthDate <= object.deathDate,
    {
      message: "Life Dates Are Ordered",
    },
  )
  birthDate?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.birthYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  @Satisfies<IndividualsDto>(
    (object) =>
      object.birthYear == null || object.deathYear == null || object.birthYear <= object.deathYear,
    {
      message: "Life Years Are Ordered",
    },
  )
  birthYear?: Year | null;

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
  @ValidateIf((object) => object.deathDate !== null)
  @IsISO8601({ strict: true })
  deathDate?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.deathYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  deathYear?: Year | null;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(IdentityKind)
  @Satisfies<IndividualsDto>((object) => object.identityKind === "individual", {
    message: "Individual Kind",
  })
  identityKind!: IdentityKind;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
