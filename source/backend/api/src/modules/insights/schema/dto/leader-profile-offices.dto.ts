import { IsOptional, IsString, ValidateIf } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Leader Profile Offices
 */
export class LeaderProfileOfficesDto {
  @IsString()
  holderId!: String;

  @IsString()
  leaderSlug!: String;

  @IsOptional()
  @ValidateIf((object) => object.leftOfficeOn !== null)
  @IsString()
  leftOfficeOn?: String | null;

  @IsString()
  office!: String;

  @IsString()
  tookOfficeOn!: String;

  @IsOptional()
  @ValidateIf((object) => object.unit !== null)
  @IsString()
  unit?: String | null;
}
