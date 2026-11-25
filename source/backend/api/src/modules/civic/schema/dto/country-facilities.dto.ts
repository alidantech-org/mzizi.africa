import { IsInt, IsOptional, IsString, IsUUID } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/**
 * Country Facilities
 */
export class CountryFacilitiesDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  classTerm?: Id;

  @IsString()
  @IsUUID()
  countryId!: Id;

  @IsOptional()
  @IsInt()
  limit?: Integer;

  @IsOptional()
  @IsInt()
  offset?: Integer;
}
