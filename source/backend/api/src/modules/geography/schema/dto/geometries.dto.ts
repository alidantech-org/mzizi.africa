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
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One full-detail drawing of a feature with its role, basis and revision. The current drawing has no end year. (entity)
 */
export class GeometriesDto {
  @IsNumber({})
  area!: GeometryArea;

  @IsString()
  @IsUUID()
  basisTerm!: Id;

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
  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  fromYear?: Year | null;

  @Allow()
  geometry!: unknown;

  @IsString()
  @IsUUID()
  @Satisfies<GeometriesDto>((object) => object.id !== object.supersedesId, {
    message: "Geometry Is Not Its Own Successor",
  })
  id!: Id;

  @IsInt()
  @Min(1)
  revision!: PositiveInteger;

  @IsString()
  @IsUUID()
  roleTerm!: Id;

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
