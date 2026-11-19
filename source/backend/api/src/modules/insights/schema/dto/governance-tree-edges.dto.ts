import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Governance Tree Edges
 */
export class GovernanceTreeEdgesDto {
  @IsString()
  from!: String;

  @IsString()
  kind!: String;

  @IsString()
  to!: String;
}
