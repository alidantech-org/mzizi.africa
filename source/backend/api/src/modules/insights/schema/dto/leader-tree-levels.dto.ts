import { Type } from "class-transformer";
import { Allow, IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator";
import { LeaderTreeLevelsUnitDto } from "#/modules/insights/schema/dto/leader-tree-levels-unit.dto.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Leader Tree Levels
 */
export class LeaderTreeLevelsDto {
  @Allow()
  groups!: unknown;

  @IsString()
  label!: String;

  @IsString()
  level!: String;

  @IsNumber({})
  total!: Number;

  @IsOptional()
  @ValidateIf((object) => object.unit !== null)
  @ValidateNested()
  @Type(() => LeaderTreeLevelsUnitDto)
  unit?: LeaderTreeLevelsUnitDto | null;
}
