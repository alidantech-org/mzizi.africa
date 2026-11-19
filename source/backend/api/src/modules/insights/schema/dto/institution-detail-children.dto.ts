import { Type } from "class-transformer";
import { IsNumber, IsString, IsDefined, ValidateNested } from "class-validator";
import { InstitutionDetailChildrenRelationDto } from "#/modules/insights/schema/dto/institution-detail-children-relation.dto.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution Detail Children
 */
export class InstitutionDetailChildrenDto {
  @IsNumber({})
  children!: Number;

  @IsString()
  code!: String;

  @IsString()
  name!: String;

  @IsDefined()
  @ValidateNested()
  @Type(() => InstitutionDetailChildrenRelationDto)
  relation!: InstitutionDetailChildrenRelationDto;
}
