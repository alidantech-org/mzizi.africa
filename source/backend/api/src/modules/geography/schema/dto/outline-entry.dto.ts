import { IsInt, IsString, IsUUID, Max, Min } from "class-validator";
import type { ZoomBand } from "#/modules/geography/schema/type/zoom-band.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/**
 * Outline Entry
 */
export class OutlineEntryDto {
  @IsInt()
  @Min(0)
  @Max(3)
  band!: ZoomBand;

  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsString()
  @IsUUID()
  geometryId!: Id;

  @IsInt()
  @Min(0)
  points!: NonNegativeInteger;

  @IsString()
  @IsUUID()
  roleTerm!: Id;
}
