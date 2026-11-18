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
 * The civic role of a geographic feature: a school, hospital, office, road, market or polling host. Size and capacity are observations on the feature; what it is and its levels are classifications; money reaches it through project links. (entity)
 */
export class FacilitiesDto {
  @IsOptional()
  @ValidateIf((object) => object.closedOn !== null)
  @IsISO8601({ strict: true })
  closedOn?: CalendarDate | null;

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
  facilityClassId!: Id;

  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.openedOn !== null)
  @IsISO8601({ strict: true })
  @Satisfies<FacilitiesDto>(
    (object) =>
      object.openedOn == null || object.closedOn == null || object.openedOn <= object.closedOn,
    {
      message: "Facility Dates Are Ordered",
    },
  )
  openedOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.operatorEntityId !== null)
  @IsString()
  @IsUUID()
  operatorEntityId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.ownerEntityId !== null)
  @IsString()
  @IsUUID()
  ownerEntityId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.ownershipId !== null)
  @IsString()
  @IsUUID()
  ownershipId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.responsibleInstitutionId !== null)
  @IsString()
  @IsUUID()
  responsibleInstitutionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsString()
  @IsUUID()
  statusId!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
