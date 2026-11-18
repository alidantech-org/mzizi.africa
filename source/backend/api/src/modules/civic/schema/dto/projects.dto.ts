import {
  Allow,
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
 * One public development or infrastructure project with responsible institution, status, geographic scope and evidence. (entity)
 */
export class ProjectsDto {
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
  @ValidateIf((object) => object.completedOn !== null)
  @IsISO8601({ strict: true })
  completedOn?: CalendarDate | null;

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
  @MaxLength(4000)
  description!: Description;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.implementingEntityId !== null)
  @IsString()
  @IsUUID()
  implementingEntityId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.location !== null)
  @Allow()
  location?: unknown | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

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

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.sponsorEntityId !== null)
  @IsString()
  @IsUUID()
  sponsorEntityId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.startedOn !== null)
  @IsISO8601({ strict: true })
  @Satisfies<ProjectsDto>(
    (object) =>
      object.startedOn == null ||
      object.completedOn == null ||
      object.startedOn <= object.completedOn,
    {
      message: "Project Dates Are Ordered",
    },
  )
  startedOn?: CalendarDate | null;

  @IsString()
  @IsUUID()
  statusId!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
