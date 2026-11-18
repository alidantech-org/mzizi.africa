import { IsNumber, IsOptional, Max, Min } from "class-validator";
import type { Latitude } from "#/modules/insights/schema/type/latitude.type.ts";
import type { Longitude } from "#/modules/insights/schema/type/longitude.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/**
 * Nearby Input
 */
export class NearbyInputDto {
  @IsNumber({})
  @Min(-90)
  @Max(90)
  latitude!: Latitude;

  @IsNumber({})
  @Min(-180)
  @Max(180)
  longitude!: Longitude;

  @IsOptional()
  @IsNumber({})
  radiusKm?: Number;
}
