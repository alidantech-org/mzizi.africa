import { Type } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsString,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { GovernanceTreeNodesBodyDto } from "#/modules/insights/schema/dto/governance-tree-nodes-body.dto.ts";
import { GovernanceTreeNodesHowDto } from "#/modules/insights/schema/dto/governance-tree-nodes-how.dto.ts";
import { GovernanceTreeNodesPerformanceDto } from "#/modules/insights/schema/dto/governance-tree-nodes-performance.dto.ts";
import { GovernanceTreeNodesRefsDto } from "#/modules/insights/schema/dto/governance-tree-nodes-refs.dto.ts";
import { GovernanceTreeNodesTierDto } from "#/modules/insights/schema/dto/governance-tree-nodes-tier.dto.ts";
import { GovernanceTreeNodesUnitDto } from "#/modules/insights/schema/dto/governance-tree-nodes-unit.dto.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Governance Tree Nodes
 */
export class GovernanceTreeNodesDto {
  @IsOptional()
  @IsString()
  arm?: String;

  @IsOptional()
  @IsString()
  basis?: String;

  @IsOptional()
  @ValidateNested()
  @Type(() => GovernanceTreeNodesBodyDto)
  body?: GovernanceTreeNodesBodyDto;

  @IsOptional()
  @IsString()
  code?: String;

  @IsOptional()
  @IsString()
  holderId?: String;

  @IsOptional()
  @ValidateNested()
  @Type(() => GovernanceTreeNodesHowDto)
  how?: GovernanceTreeNodesHowDto;

  @IsString()
  id!: String;

  @IsOptional()
  @IsString()
  kind?: String;

  @IsOptional()
  @IsString()
  leaderSlug?: String;

  @IsOptional()
  @IsNumber({})
  leaders?: Number;

  @IsString()
  level!: String;

  @IsString()
  name!: String;

  @IsOptional()
  @ValidateIf((object) => object.party !== null)
  @IsString()
  party?: String | null;

  @IsOptional()
  @ValidateIf((object) => object.performance !== null)
  @ValidateNested()
  @Type(() => GovernanceTreeNodesPerformanceDto)
  performance?: GovernanceTreeNodesPerformanceDto | null;

  @IsOptional()
  @IsString()
  photo?: String;

  @IsOptional()
  @ValidateIf((object) => object.purpose !== null)
  @IsString()
  purpose?: String | null;

  @IsDefined()
  @ValidateNested()
  @Type(() => GovernanceTreeNodesRefsDto)
  refs!: GovernanceTreeNodesRefsDto;

  @IsOptional()
  @IsString()
  since?: String;

  @IsOptional()
  @ValidateNested()
  @Type(() => GovernanceTreeNodesTierDto)
  tier?: GovernanceTreeNodesTierDto;

  @IsString()
  type!: String;

  @IsOptional()
  @ValidateNested()
  @Type(() => GovernanceTreeNodesUnitDto)
  unit?: GovernanceTreeNodesUnitDto;
}
