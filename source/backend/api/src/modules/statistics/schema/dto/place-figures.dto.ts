import { IsInt, IsOptional, IsString, IsUUID } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/**
 * Place Figures
 */
export class PlaceFiguresDto {
  @IsString()
  @IsUUID()
  countryId!: Id;

  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsOptional()
  @IsString()
  @IsUUID()
  indicatorId?: Id;

  @IsOptional()
  @IsInt()
  limit?: Integer;

  @IsOptional()
  @IsInt()
  offset?: Integer;
}
