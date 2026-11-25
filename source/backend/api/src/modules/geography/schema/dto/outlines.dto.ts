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

import type { Tolerance } from "#/modules/geography/schema/type/tolerance.type.ts";
import type { ZoomBand } from "#/modules/geography/schema/type/zoom-band.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A prepared, simplified outline of a geometry for one zoom band; rebuilt when its geometry changes. (entity)
 */
export class OutlinesDto {
  @IsInt()
  @Min(0)
  @Max(3)
  band!: ZoomBand;

  @Allow()
  bbox!: unknown;

  @IsISO8601({})
  builtAt!: Instant;

  @Allow()
  centroid!: unknown;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  featureId!: Id;

  @Allow()
  geometry!: unknown;

  @IsString()
  @IsUUID()
  geometryId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsInt()
  @Min(0)
  points!: NonNegativeInteger;

  @IsNumber({})
  tolerance!: Tolerance;
}
