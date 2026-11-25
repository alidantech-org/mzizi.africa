import { IsInt, Max, Min } from "class-validator";
import type { ZoomBand } from "#/modules/geography/schema/type/zoom-band.type.ts";

/**
 * Child Outline Entry Outlines
 */
export class ChildOutlineEntryOutlinesDto {
  @IsInt()
  @Min(0)
  @Max(3)
  band!: ZoomBand;
}
