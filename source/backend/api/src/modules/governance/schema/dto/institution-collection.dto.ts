import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { InstitutionEntryDto } from "#/modules/governance/schema/dto/institution-entry.dto.ts";

/**
 * Institution Collection
 */
export class InstitutionCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => InstitutionEntryDto)
  institutions!: InstitutionEntryDto[];
}
