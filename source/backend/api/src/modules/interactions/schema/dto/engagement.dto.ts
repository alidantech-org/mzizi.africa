import { IsBoolean, IsInt, Min } from "class-validator";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/**
 * Engagement
 */
export class EngagementDto {
  @IsBoolean()
  liked!: Flag;

  @IsInt()
  @Min(0)
  likes!: NonNegativeInteger;
}
