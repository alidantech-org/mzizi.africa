import { Allow, IsArray, IsString, MaxLength, MinLength } from "class-validator";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Party Detail
 */
export class PartyDetailDto {
  @IsArray()
  @Allow()
  funding!: Record<string, unknown>[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @Allow()
  members!: Record<string, unknown>[];

  @Allow()
  party!: Record<string, unknown>;

  @IsArray()
  @Allow()
  results!: Record<string, unknown>[];
}
