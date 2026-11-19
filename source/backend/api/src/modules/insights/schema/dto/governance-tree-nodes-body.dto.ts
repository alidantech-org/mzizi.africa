import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Governance Tree Nodes Body
 */
export class GovernanceTreeNodesBodyDto {
  @IsString()
  code!: String;

  @IsString()
  name!: String;
}
