import { IsInt, IsOptional, IsString, IsUUID } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/**
 * Instrument Window
 */
export class InstrumentWindowDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  kindTerm?: Id;

  @IsOptional()
  @IsInt()
  limit?: Integer;

  @IsOptional()
  @IsInt()
  offset?: Integer;
}
