import {
  Allow,
  IsEnum,
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
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { GeometryArea } from "#/modules/geography/schema/type/geometry-area.type.ts";
import type { Confidence } from "#/modules/shared/schema/type/confidence.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
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
  @ValidateIf((object) => object.fromToPrecision !== null)
  @IsEnum(DatePrecision)
  fromToPrecision?: DatePrecision | null;

  @IsOptional()
  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  @Satisfies<GeometriesDto>(
    (object) =>
      object.fromYear == null || object.toYear == null || object.fromYear <= object.toYear,
    {
      message: "Period Years Are Ordered",
    },
  )
  fromYear?: Year | null;

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

  @IsInt()
  @Min(1)
  srid!: PositiveInteger;

  @IsOptional()
  @ValidateIf((object) => object.supersedesId !== null)
  @IsString()
  @IsUUID()
  supersedesId?: Id | null;

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
