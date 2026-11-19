import { IsNumber, IsString } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Compare Options Nearby
 */
export class CompareOptionsNearbyDto {
  @IsNumber({})
  distanceKm!: Number;

  @IsString()
  featureId!: String;

  @IsString()
  kindLabel!: String;

  @IsString()
  name!: String;

  @IsString()
  path!: String;
}
