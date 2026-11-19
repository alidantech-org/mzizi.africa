import { Type } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsString,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { GovernanceTreeRailRefsDto } from "#/modules/insights/schema/dto/governance-tree-rail-refs.dto.ts";
import { GovernanceTreeRailUnitDto } from "#/modules/insights/schema/dto/governance-tree-rail-unit.dto.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Governance Tree Rail
 */
export class GovernanceTreeRailDto {
  @IsString()
  about!: String;

  @IsString()
  code!: String;

  @IsNumber({})
  count!: Number;

  @IsString()
  label!: String;

  @IsDefined()
  @ValidateNested()
  @Type(() => GovernanceTreeRailRefsDto)
  refs!: GovernanceTreeRailRefsDto;

  @IsOptional()
  @ValidateIf((object) => object.unit !== null)
  @ValidateNested()
  @Type(() => GovernanceTreeRailUnitDto)
  unit?: GovernanceTreeRailUnitDto | null;
}
