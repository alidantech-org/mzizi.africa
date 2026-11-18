import { Allow, IsArray, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/**
 * Nearby Projects
 */
export class NearbyProjectsDto {
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @Allow()
  projects!: Record<string, unknown>[];

  @IsNumber({})
  radiusKm!: Number;
}
