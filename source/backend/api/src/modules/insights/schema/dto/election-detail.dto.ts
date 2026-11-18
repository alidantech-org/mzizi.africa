import { Allow, IsArray, IsString, MaxLength, MinLength } from "class-validator";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Election Detail
 */
export class ElectionDetailDto {
  @IsArray()
  @Allow()
  contests!: Record<string, unknown>[];

  @Allow()
  election!: Record<string, unknown>;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @Allow()
  totals!: Record<string, unknown>[];

  @IsArray()
  @Allow()
  units!: Record<string, unknown>[];
}
