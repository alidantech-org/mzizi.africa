import { IsBoolean, IsInt, IsString, IsUUID, Min } from "class-validator";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/**
 * Indicator Detail Dimensions
 */
export class IndicatorDetailDimensionsDto {
  @IsBoolean()
  isRequired!: Flag;

  @IsInt()
  @Min(0)
  position!: NonNegativeInteger;

  @IsString()
  @IsUUID()
  schemeId!: Id;
}
