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
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One provider's service provision at a physical place or geographic coverage unit during a service period. (entity)
 */
export class ServicesDto {
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

  @IsString()
  @MaxLength(4000)
  description!: Description;

  @IsOptional()
  @ValidateIf((object) => object.endsOn !== null)
  @IsISO8601({ strict: true })
  endsOn?: CalendarDate | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsOptional()
  @ValidateIf((object) => object.placeFeatureId !== null)
  @IsString()
  @IsUUID()
  @Satisfies<ServicesDto>(
    (object) => object.placeFeatureId != null || object.scopeUnitFeatureId != null,
    {
      message: "Has Place Or Coverage",
    },
  )
  placeFeatureId?: Id | null;

  @IsString()
  @IsUUID()
  providerEntityId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.responsibleInstitutionId !== null)
  @IsString()
  @IsUUID()
  responsibleInstitutionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.scopeUnitFeatureId !== null)
  @IsString()
  @IsUUID()
  scopeUnitFeatureId?: Id | null;

  @IsString()
  @IsUUID()
  serviceKindId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.startsOn !== null)
  @IsISO8601({ strict: true })
  @Satisfies<ServicesDto>(
    (object) =>
      object.startsOn == null || object.endsOn == null || object.startsOn <= object.endsOn,
    {
      message: "Service Dates Are Ordered",
    },
  )
  startsOn?: CalendarDate | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
