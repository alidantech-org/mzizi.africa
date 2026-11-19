import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Governance Tabs Arms Institutions Kind
 */
export class GovernanceTabsArmsInstitutionsKindDto {
  @IsString()
  code!: String;

  @IsString()
  label!: String;
}
