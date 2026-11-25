import { IsInt, IsOptional } from "class-validator";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/**
 * Release Window
 */
export class ReleaseWindowDto {
  @IsOptional()
  @IsInt()
  limit?: Integer;

  @IsOptional()
  @IsInt()
  offset?: Integer;
}
