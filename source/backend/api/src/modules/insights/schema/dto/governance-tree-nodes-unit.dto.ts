import { IsOptional, IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Governance Tree Nodes Unit
 */
export class GovernanceTreeNodesUnitDto {
  @IsString()
  featureId!: String;

  @IsString()
  name!: String;

  @IsOptional()
  @IsString()
  path?: String;
}
