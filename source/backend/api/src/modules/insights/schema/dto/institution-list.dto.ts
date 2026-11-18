import { Allow, IsArray, IsInt, IsString, MaxLength, Min, MinLength } from "class-validator";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/**
 * Institution List
 */
export class InstitutionListDto {
  @IsArray()
  @Allow()
  arms!: Record<string, unknown>[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsInt()
  @Min(0)
  total!: NonNegativeInteger;
}
