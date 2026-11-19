import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Governance Tree Rail Refs
 */
export class GovernanceTreeRailRefsDto {
  @IsString()
  code!: String;

  @IsString()
  kind!: String;

  @IsString()
  table!: String;
}
