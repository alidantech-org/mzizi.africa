import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A dated link between places; a parent link in a hierarchy also records the inner place's level. (entity)
 */
export class RelationshipsDto {
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

  @IsOptional()
  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  @Satisfies<RelationshipsDto>(
    (object) =>
      object.fromYear == null || object.toYear == null || object.fromYear <= object.toYear,
    {
      message: "Relationship Period Is Ordered",
    },
  )
  fromYear?: Year | null;

  @IsOptional()
  @ValidateIf((object) => object.hierarchyId !== null)
  @IsString()
  @IsUUID()
  hierarchyId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.levelId !== null)
  @IsString()
  @IsUUID()
  @Satisfies<RelationshipsDto>((object) => object.levelId == null || object.hierarchyId != null, {
    message: "Level Needs Hierarchy",
  })
  levelId?: Id | null;

  @IsString()
  @IsUUID()
  objectFeatureId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.startsOn !== null)
  @IsISO8601({ strict: true })
  @Satisfies<RelationshipsDto>(
    (object) =>
      object.startsOn == null || object.endsOn == null || object.startsOn <= object.endsOn,
    {
      message: "Relationship Dates Are Ordered",
    },
  )
  startsOn?: CalendarDate | null;

  @IsString()
  @IsUUID()
  @Satisfies<RelationshipsDto>((object) => object.subjectFeatureId !== object.objectFeatureId, {
    message: "Relationship Is Not Self",
  })
  subjectFeatureId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.toYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  toYear?: Year | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
