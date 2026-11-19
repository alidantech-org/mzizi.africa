import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { GovernanceTabsArmsDto } from "#/modules/insights/schema/dto/governance-tabs-arms.dto.ts";
import { GovernanceTabsTabsDto } from "#/modules/insights/schema/dto/governance-tabs-tabs.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Governance Tabs
 */
export class GovernanceTabsDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => GovernanceTabsArmsDto)
  arms!: GovernanceTabsArmsDto[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => GovernanceTabsTabsDto)
  tabs!: GovernanceTabsTabsDto[];
}
