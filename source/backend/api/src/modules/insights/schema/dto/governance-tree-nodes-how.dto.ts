import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Governance Tree Nodes How
 */
export class GovernanceTreeNodesHowDto {
  @IsString()
  code!: String;

  @IsString()
  label!: String;
}
