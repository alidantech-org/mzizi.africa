import { IsOptional, IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Place Statistics Comparisons Place
 */
export class PlaceStatisticsComparisonsPlaceDto {
  @IsString()
  featureId!: String;

  @IsString()
  kindCode!: String;

  @IsString()
  kindLabel!: String;

  @IsString()
  name!: String;

  @IsOptional()
  @IsString()
  path?: String;
}
