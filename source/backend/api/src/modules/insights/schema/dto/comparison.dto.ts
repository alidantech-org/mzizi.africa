import { Allow, IsArray, IsString, MaxLength, MinLength } from "class-validator";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Comparison
 */
export class ComparisonDto {
  @Allow()
  a!: Record<string, unknown>;

  @Allow()
  b!: Record<string, unknown>;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @Allow()
  rows!: Record<string, unknown>[];
}
