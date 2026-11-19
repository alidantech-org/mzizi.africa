import { IsOptional, IsString, ValidateIf } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Governance Tree Tab
 */
export class GovernanceTreeTabDto {
  @IsString()
  about!: String;

  @IsString()
  code!: String;

  @IsOptional()
  @ValidateIf((object) => object.institution !== null)
  @IsString()
  institution?: String | null;

  @IsString()
  label!: String;
}
