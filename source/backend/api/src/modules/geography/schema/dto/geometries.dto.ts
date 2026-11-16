import {
  Allow,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { GeometryArea } from "#/modules/geography/schema/type/geometry-area.type.ts";
import type { Confidence } from "#/modules/shared/schema/type/confidence.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One drawing of a feature: a revision with a role, a basis, a confidence, a zoom range, a validity period and the stored file it came from. A feature has many; the current one has no end date. (entity)
 */
export class GeometriesDto {
  @IsNumber({})
  area!: GeometryArea;

  @IsString()
  @IsUUID()
  basisId!: Id;

  @Allow()
  centroid!: unknown;

  @IsOptional()
  @ValidateIf((object) => object.confidence !== null)
  @IsNumber({})
  @Min(0)
  @Max(1)
  confidence?: Confidence | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @Allow()
  envelope!: unknown;

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
  @Satisfies<GeometriesDto>((object) => object.id !== object.supersedesId, {
    message: "Geometry Must Not Supersede Itself",
  })
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.maxZoom !== null)
  @IsInt()
  @Min(0)
  maxZoom?: NonNegativeInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.minZoom !== null)
  @IsInt()
  @Min(0)
  @Satisfies<GeometriesDto>(
    (object) => object.minZoom == null || object.maxZoom == null || object.minZoom < object.maxZoom,
    {
      message: "Zoom Range Must Be Ordered",
    },
  )
  minZoom?: NonNegativeInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.observedAt !== null)
  @IsISO8601({})
  observedAt?: Instant | null;

  @IsInt()
  @Min(1)
  revision!: PositiveInteger;

  @IsOptional()
  @ValidateIf((object) => object.sourceRefId !== null)
  @IsString()
  @IsUUID()
  sourceRefId?: Id | null;

  @IsInt()
  @Min(1)
  srid!: PositiveInteger;

  @IsOptional()
  @ValidateIf((object) => object.supersedesId !== null)
  @IsString()
  @IsUUID()
  supersedesId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.validFrom !== null)
  @IsISO8601({ strict: true })
  @Satisfies<GeometriesDto>(
    (object) =>
      object.validFrom == null || object.validUntil == null || object.validFrom < object.validUntil,
    {
      message: "Validity Window Is Ordered",
    },
  )
  validFrom?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.validFromEarliest !== null)
  @IsISO8601({ strict: true })
  @Satisfies<GeometriesDto>(
    (object) =>
      object.validFromEarliest == null ||
      object.validFromLatest == null ||
      object.validFromEarliest < object.validFromLatest,
    {
      message: "Start Bounds Are Ordered",
    },
  )
  validFromEarliest?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.validFromLatest !== null)
  @IsISO8601({ strict: true })
  validFromLatest?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.validUntil !== null)
  @IsISO8601({ strict: true })
  validUntil?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.validUntilEarliest !== null)
  @IsISO8601({ strict: true })
  @Satisfies<GeometriesDto>(
    (object) =>
      object.validUntilEarliest == null ||
      object.validUntilLatest == null ||
      object.validUntilEarliest < object.validUntilLatest,
    {
      message: "End Bounds Are Ordered",
    },
  )
  validUntilEarliest?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.validUntilLatest !== null)
  @IsISO8601({ strict: true })
  validUntilLatest?: CalendarDate | null;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
