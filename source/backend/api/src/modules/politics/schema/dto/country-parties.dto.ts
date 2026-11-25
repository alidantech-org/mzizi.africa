import { IsInt, IsOptional, IsString, IsUUID } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/**
 * Country Parties
 */
export class CountryPartiesDto {
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
