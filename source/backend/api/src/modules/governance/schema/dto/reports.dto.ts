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
 * One expected or found filing under an obligation, for one reporter and period, with its status and the document when found. Absence is a status, not a missing row. (entity)
 */
export class ReportsDto {
  @IsOptional()
  @ValidateIf((object) => object.artifactId !== null)
  @IsString()
  @IsUUID()
  artifactId?: Id | null;

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

  @IsOptional()
  @ValidateIf((object) => object.filedOn !== null)
  @IsISO8601({ strict: true })
  filedOn?: CalendarDate | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  obligationId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.periodFrom !== null)
  @IsISO8601({ strict: true })
  @Satisfies<ReportsDto>(
    (object) =>
      object.periodFrom == null ||
      object.periodUntil == null ||
      object.periodFrom <= object.periodUntil,
    {
      message: "Report Period Is Ordered",
    },
  )
  periodFrom?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.periodUntil !== null)
  @IsISO8601({ strict: true })
  periodUntil?: CalendarDate | null;

  @IsString()
  @IsUUID()
  reporterEntityId!: Id;

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
