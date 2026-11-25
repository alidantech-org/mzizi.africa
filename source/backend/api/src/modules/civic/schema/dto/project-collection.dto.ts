import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { ProjectEntryDto } from "#/modules/civic/schema/dto/project-entry.dto.ts";

/**
 * Project Collection
 */
export class ProjectCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ProjectEntryDto)
  projects!: ProjectEntryDto[];
}
