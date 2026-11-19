import { IsOptional, IsString, ValidateIf } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Party Detail Members
 */
export class PartyDetailMembersDto {
  @IsOptional()
  @ValidateIf((object) => object.holderId !== null)
  @IsString()
  holderId?: String | null;

  @IsString()
  individualId!: String;

  @IsOptional()
  @IsString()
  leaderSlug?: String;

  @IsString()
  name!: String;

  @IsOptional()
  @ValidateIf((object) => object.office !== null)
  @IsString()
  office?: String | null;

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
