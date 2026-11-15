
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

import { Satisfies } from "#/modules/common/dto/validators/satisfies.ts";
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/type/instant.type.ts";

/**
 * Stable identity for one organization or legally identified entity; its names are stored in official.names. (entity)
 */
export class EntitiesDto {

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(new RegExp("^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"))
  code!: IdentityCode;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.dissolvedOn !== null)
  @IsISO8601({ strict: true })
  dissolvedOn?: CalendarDate | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  kindId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.registeredOn !== null)
  @IsISO8601({ strict: true })
  @Satisfies<EntitiesDto>((object) => object.registeredOn == null || object.dissolvedOn == null || object.registeredOn <= object.dissolvedOn, {
    message: "Registration And Dissolution Are Ordered",
  })
  registeredOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.registrationCountryId !== null)
  @IsString()
  @IsUUID()
  registrationCountryId?: Id | null;

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