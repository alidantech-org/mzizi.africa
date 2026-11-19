import { IsNumber, IsString } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Governance Tree Nodes Performance
 */
export class GovernanceTreeNodesPerformanceDto {
  @IsString()
  basis!: String;

  @IsNumber({})
  of!: Number;

  @IsNumber({})
  rank!: Number;

  @IsNumber({})
  samples!: Number;

  @IsNumber({})
  score!: Number;

  @IsString()
  text!: String;
}
