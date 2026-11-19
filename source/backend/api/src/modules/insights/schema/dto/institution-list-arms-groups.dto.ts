import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { InstitutionListArmsGroupsInstitutionsDto } from "#/modules/insights/schema/dto/institution-list-arms-groups-institutions.dto.ts";
import { InstitutionListArmsGroupsKindDto } from "#/modules/insights/schema/dto/institution-list-arms-groups-kind.dto.ts";

/**
 * Institution List Arms Groups
 */
export class InstitutionListArmsGroupsDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => InstitutionListArmsGroupsInstitutionsDto)
  institutions!: InstitutionListArmsGroupsInstitutionsDto[];

  @IsDefined()
  @ValidateNested()
  @Type(() => InstitutionListArmsGroupsKindDto)
  kind!: InstitutionListArmsGroupsKindDto;
}
