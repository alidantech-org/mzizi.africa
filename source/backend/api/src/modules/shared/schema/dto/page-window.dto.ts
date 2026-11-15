import { IsInt, IsOptional } from "class-validator";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/**
 * Page Window
 */
export class PageWindowDto {
  @IsOptional()
  @IsInt()
  limit?: Integer;

  @IsOptional()
  @IsInt()
  offset?: Integer;
}
