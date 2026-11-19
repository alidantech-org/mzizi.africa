import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, IsDefined, ValidateNested } from "class-validator";
import { InstitutionListArmsGroupsDto } from "#/modules/insights/schema/dto/institution-list-arms-groups.dto.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution List Arms
 */
export class InstitutionListArmsDto {
  @IsString()
  about!: String;

  @IsString()
  code!: String;

  @IsNumber({})
  count!: Number;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => InstitutionListArmsGroupsDto)
  groups!: InstitutionListArmsGroupsDto[];

  @IsString()
  label!: String;
}
