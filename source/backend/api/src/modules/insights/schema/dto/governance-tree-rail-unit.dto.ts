import { IsOptional, IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Governance Tree Rail Unit
 */
export class GovernanceTreeRailUnitDto {
  @IsString()
  featureId!: String;

  @IsString()
  kindCode!: String;

  @IsString()
  kindLabel!: String;

  @IsString()
  name!: String;

  @IsOptional()
  @IsString()
  path?: String;
}
