import { Type } from "class-transformer";
import { IsArray, IsString, IsDefined, ValidateNested } from "class-validator";
import { GovernanceTabsArmsInstitutionsDto } from "#/modules/insights/schema/dto/governance-tabs-arms-institutions.dto.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Governance Tabs Arms
 */
export class GovernanceTabsArmsDto {
  @IsString()
  about!: String;

  @IsString()
  code!: String;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => GovernanceTabsArmsInstitutionsDto)
  institutions!: GovernanceTabsArmsInstitutionsDto[];

  @IsString()
  label!: String;
}
