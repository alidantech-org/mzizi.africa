import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { ElectionListElectionsDto } from "#/modules/insights/schema/dto/election-list-elections.dto.ts";

/**
 * Election List
 */
export class ElectionListDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ElectionListElectionsDto)
  elections!: ElectionListElectionsDto[];
}
