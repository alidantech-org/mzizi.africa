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
import type { Confidence } from "#/modules/shared/schema/type/confidence.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Feature Geometry
 */
export class FeatureGeometryDto {
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

  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  fromYear?: Integer | null;

  @Allow()
  geometry!: unknown;

  @IsString()
  @IsUUID()
  geometryId!: Id;

  @IsString()
  @IsUUID()
  geometryRoleId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.maxZoom !== null)
  @IsInt()
  @Min(0)
  maxZoom?: NonNegativeInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.minZoom !== null)
  @IsInt()
  @Min(0)
  minZoom?: NonNegativeInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.observedAt !== null)
  @IsISO8601({})
  observedAt?: Instant | null;

  @IsInt()
  @Min(1)
  revision!: PositiveInteger;
}
