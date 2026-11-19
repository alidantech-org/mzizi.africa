import { IsOptional, IsString, ValidateIf } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Motion Detail Members
 */
export class MotionDetailMembersDto {
  @IsString()
  holderId!: String;

  @IsString()
  individualId!: String;

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

  @IsOptional()
  @ValidateIf((object) => object.partyCode !== null)
  @IsString()
  partyCode?: String | null;

  @IsString()
  position!: String;

  @IsOptional()
  @ValidateIf((object) => object.unit !== null)
  @IsString()
  unit?: String | null;
}
