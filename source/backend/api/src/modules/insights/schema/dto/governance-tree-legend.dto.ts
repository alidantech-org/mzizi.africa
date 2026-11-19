import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Governance Tree Legend
 */
export class GovernanceTreeLegendDto {
  @IsString()
  code!: String;

  @IsString()
  label!: String;
}
