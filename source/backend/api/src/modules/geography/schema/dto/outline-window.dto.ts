import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";
import type { ZoomBand } from "#/modules/geography/schema/type/zoom-band.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/**
 * Outline Window
 */
export class OutlineWindowDto {
  @IsInt()
  @Min(0)
  @Max(3)
  band!: ZoomBand;

  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsOptional()
  @IsInt()
  limit?: Integer;

  @IsOptional()
  @IsInt()
  offset?: Integer;
}
