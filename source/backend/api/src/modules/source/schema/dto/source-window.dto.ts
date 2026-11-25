import { IsInt, IsOptional } from "class-validator";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/**
 * Source Window
 */
export class SourceWindowDto {
  @IsOptional()
  @IsInt()
  limit?: Integer;

  @IsOptional()
  @IsInt()
  offset?: Integer;
}
