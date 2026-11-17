import { IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";
import type { Latitude } from "#/modules/geography/schema/type/latitude.type.ts";
import type { Longitude } from "#/modules/geography/schema/type/longitude.type.ts";
import type { Tolerance } from "#/modules/geography/schema/type/tolerance.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/**
 * Geometry Window
 */
export class GeometryWindowDto {
  @IsNumber({})
  @Min(-180)
  @Max(180)
  east!: Longitude;

  @IsOptional()
  @IsString()
  @IsUUID()
  featureTypeId?: Id;

  @IsOptional()
  @IsInt()
  limit?: Integer;

  @IsNumber({})
  @Min(-90)
  @Max(90)
  north!: Latitude;

  @IsOptional()
  @IsInt()
  offset?: Integer;

  @IsOptional()
  @IsNumber({})
  @Min(0)
  simplifyTolerance?: Tolerance;

  @IsNumber({})
  @Min(-90)
  @Max(90)
  south!: Latitude;

  @IsNumber({})
  @Min(-180)
  @Max(180)
  west!: Longitude;

  @IsInt()
  @Min(0)
  zoom!: NonNegativeInteger;
}
