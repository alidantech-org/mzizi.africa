import { Type } from "class-transformer";
import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { GovernanceTreeEdgesDto } from "#/modules/insights/schema/dto/governance-tree-edges.dto.ts";
import { GovernanceTreeLegendDto } from "#/modules/insights/schema/dto/governance-tree-legend.dto.ts";
import { GovernanceTreeNodesDto } from "#/modules/insights/schema/dto/governance-tree-nodes.dto.ts";
import { GovernanceTreeRailDto } from "#/modules/insights/schema/dto/governance-tree-rail.dto.ts";
import { GovernanceTreeTabDto } from "#/modules/insights/schema/dto/governance-tree-tab.dto.ts";
import { PlaceCrumbDto } from "#/modules/insights/schema/dto/place-crumb.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Governance Tree
 */
export class GovernanceTreeDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => GovernanceTreeEdgesDto)
  edges!: GovernanceTreeEdgesDto[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => GovernanceTreeLegendDto)
  legend!: GovernanceTreeLegendDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => GovernanceTreeNodesDto)
  nodes!: GovernanceTreeNodesDto[];

  @IsOptional()
  @ValidateIf((object) => object.place !== null)
  @ValidateNested()
  @Type(() => PlaceCrumbDto)
  place?: PlaceCrumbDto | null;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => GovernanceTreeRailDto)
  rail!: GovernanceTreeRailDto[];

  @IsOptional()
  @ValidateIf((object) => object.tab !== null)
  @ValidateNested()
  @Type(() => GovernanceTreeTabDto)
  tab?: GovernanceTreeTabDto | null;
}
