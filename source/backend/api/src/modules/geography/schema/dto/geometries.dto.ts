
import {
  Allow,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A dated spatial representation version for a feature. The geometry field remains an unsupported Dryv placeholder and is excluded from generation. (entity)
 */
export class GeometriesDto {

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.fileVersionRefId !== null)
  @IsString()
  @IsUUID()
  fileVersionRefId?: Id | null;

  @Allow()
  geometry!: unknown;

  @IsString()
  @IsUUID()
  geometryRoleId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.observedAt !== null)
  @IsISO8601({})
  observedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceRefId !== null)
  @IsString()
  @IsUUID()
  sourceRefId?: Id | null;

  @IsInt()
  @Min(1)
  srid!: PositiveInteger;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.validFrom !== null)
  @IsISO8601({ strict: true })
  @Satisfies<GeometriesDto>((object) => object.validFrom == null || object.validUntil == null || object.validFrom < object.validUntil, {
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