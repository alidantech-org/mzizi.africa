import { Type } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsString,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { InstitutionListArmsGroupsInstitutionsArmDto } from "#/modules/insights/schema/dto/institution-list-arms-groups-institutions-arm.dto.ts";
import { InstitutionListArmsGroupsInstitutionsBasisDto } from "#/modules/insights/schema/dto/institution-list-arms-groups-institutions-basis.dto.ts";
import { InstitutionListArmsGroupsInstitutionsKindDto } from "#/modules/insights/schema/dto/institution-list-arms-groups-institutions-kind.dto.ts";
import { InstitutionListArmsGroupsInstitutionsParentDto } from "#/modules/insights/schema/dto/institution-list-arms-groups-institutions-parent.dto.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution List Arms Groups Institutions
 */
export class InstitutionListArmsGroupsInstitutionsDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => InstitutionListArmsGroupsInstitutionsArmDto)
  arm!: InstitutionListArmsGroupsInstitutionsArmDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => InstitutionListArmsGroupsInstitutionsBasisDto)
  basis!: InstitutionListArmsGroupsInstitutionsBasisDto;

  @IsNumber({})
  children!: Number;

  @IsString()
  code!: String;

  @IsOptional()
  @ValidateIf((object) => object.image !== null)
  @IsString()
  image?: String | null;

  @IsDefined()
  @ValidateNested()
  @Type(() => InstitutionListArmsGroupsInstitutionsKindDto)
  kind!: InstitutionListArmsGroupsInstitutionsKindDto;

  @IsNumber({})
  leaders!: Number;

  @IsString()
  name!: String;

  @IsOptional()
  @ValidateIf((object) => object.parent !== null)
  @ValidateNested()
  @Type(() => InstitutionListArmsGroupsInstitutionsParentDto)
  parent?: InstitutionListArmsGroupsInstitutionsParentDto | null;

  @IsString()
  purpose!: String;
}
