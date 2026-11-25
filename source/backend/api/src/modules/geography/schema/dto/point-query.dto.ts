import { IsNumber, Max, Min } from "class-validator";
import type { Latitude } from "#/modules/geography/schema/type/latitude.type.ts";
import type { Longitude } from "#/modules/geography/schema/type/longitude.type.ts";

/**
 * Point Query
 */
export class PointQueryDto {
  @IsNumber({})
  @Min(-90)
  @Max(90)
  latitude!: Latitude;

  @IsNumber({})
  @Min(-180)
  @Max(180)
  longitude!: Longitude;
}
