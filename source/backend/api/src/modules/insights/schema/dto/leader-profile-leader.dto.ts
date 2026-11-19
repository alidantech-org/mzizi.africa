import { IsOptional, IsString, ValidateIf } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Leader Profile Leader
 */
export class LeaderProfileLeaderDto {
  @IsString()
  birthDate!: String;

  @IsString()
  holderId!: String;

  @IsString()
  individualId!: String;

  @IsString()
  institution!: String;

  @IsString()
  leaderSlug!: String;

  @IsString()
  name!: String;

  @IsString()
  office!: String;

  @IsOptional()
  @ValidateIf((object) => object.party !== null)
  @IsString()
  party?: String | null;

  @IsString()
  tookOfficeOn!: String;

  @IsOptional()
  @ValidateIf((object) => object.unit !== null)
  @IsString()
  unit?: String | null;

  @IsOptional()
  @ValidateIf((object) => object.unitId !== null)
  @IsString()
  unitId?: String | null;

  @IsOptional()
  @IsString()
  unitPath?: String;
}
