import { Type } from "class-transformer";
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { InstitutionDetailInstitutionArmDto } from "#/modules/insights/schema/dto/institution-detail-institution-arm.dto.ts";
import { InstitutionDetailInstitutionBasisDto } from "#/modules/insights/schema/dto/institution-detail-institution-basis.dto.ts";
import { InstitutionDetailInstitutionKindDto } from "#/modules/insights/schema/dto/institution-detail-institution-kind.dto.ts";
import { InstitutionDetailInstitutionParentDto } from "#/modules/insights/schema/dto/institution-detail-institution-parent.dto.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution Detail Institution
 */
export class InstitutionDetailInstitutionDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => InstitutionDetailInstitutionArmDto)
  arm!: InstitutionDetailInstitutionArmDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => InstitutionDetailInstitutionBasisDto)
  basis!: InstitutionDetailInstitutionBasisDto;

  @IsNumber({})
  children!: Number;

  @IsString()
  code!: String;

  @IsOptional()
  @ValidateIf((object) => object.established !== null)
  @IsString()
  established?: String | null;

  @IsArray()
  @IsString({ each: true })
  functions!: String[];

  @IsOptional()
  @ValidateIf((object) => object.image !== null)
  @IsString()
  image?: String | null;

  @IsDefined()
  @ValidateNested()
  @Type(() => InstitutionDetailInstitutionKindDto)
  kind!: InstitutionDetailInstitutionKindDto;

  @IsNumber({})
  leaders!: Number;

  @IsString()
  name!: String;

  @IsOptional()
  @ValidateIf((object) => object.parent !== null)
  @ValidateNested()
  @Type(() => InstitutionDetailInstitutionParentDto)
  parent?: InstitutionDetailInstitutionParentDto | null;

  @IsString()
  purpose!: String;
}
