import { IsOptional, IsString, ValidateIf } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution Detail Leaders Tier
 */
export class InstitutionDetailLeadersTierDto {
  @IsString()
  code!: String;

  @IsString()
  label!: String;

  @IsOptional()
  @ValidateIf((object) => object.parent !== null)
  @IsString()
  parent?: String | null;
}
