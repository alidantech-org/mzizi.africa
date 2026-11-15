
import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/dto/validators/satisfies.ts";
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/type/instant.type.ts";

/**
 * A typed, dated directed relationship between features; separate rows allow overlapping administrative, electoral, statistical and other systems. (entity)
 */
export class RelationshipsDto {

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  objectFeatureId!: Id;

  @IsString()
  @IsUUID()
  relationshipKindId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.sourceRefId !== null)
  @IsString()
  @IsUUID()
  sourceRefId?: Id | null;

  @IsString()
  @IsUUID()
  @Satisfies<RelationshipsDto>((object) => object.subjectFeatureId !== object.objectFeatureId, {
    message: "Relationship Must Not Be Self Referential",
  })
  subjectFeatureId!: Id;

  @IsString()
  @IsUUID()
  systemId!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.validFrom !== null)
  @IsISO8601({ strict: true })
  @Satisfies<RelationshipsDto>((object) => object.validFrom == null || object.validUntil == null || object.validFrom < object.validUntil, {
    message: "Validity Window Is Ordered",
  })
  validFrom?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.validUntil !== null)
  @IsISO8601({ strict: true })
  validUntil?: CalendarDate | null;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}