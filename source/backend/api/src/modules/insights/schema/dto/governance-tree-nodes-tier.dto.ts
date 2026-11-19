import { IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Governance Tree Nodes Tier
 */
export class GovernanceTreeNodesTierDto {
  @IsString()
  code!: String;

  @IsString()
  label!: String;

  @IsOptional()
  @ValidateIf((object) => object.position !== null)
  @IsNumber({})
  position?: Number | null;
}
