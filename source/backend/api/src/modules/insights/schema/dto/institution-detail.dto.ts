import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { InstitutionDetailChildrenDto } from "#/modules/insights/schema/dto/institution-detail-children.dto.ts";
import { InstitutionDetailContentDto } from "#/modules/insights/schema/dto/institution-detail-content.dto.ts";
import { InstitutionDetailInstitutionDto } from "#/modules/insights/schema/dto/institution-detail-institution.dto.ts";
import { InstitutionDetailLeadersDto } from "#/modules/insights/schema/dto/institution-detail-leaders.dto.ts";
import { InstitutionDetailLegalBasisDto } from "#/modules/insights/schema/dto/institution-detail-legal-basis.dto.ts";
import { InstitutionDetailMetricsDto } from "#/modules/insights/schema/dto/institution-detail-metrics.dto.ts";
import { InstitutionDetailParentsDto } from "#/modules/insights/schema/dto/institution-detail-parents.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Institution Detail
 */
export class InstitutionDetailDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => InstitutionDetailChildrenDto)
  children!: InstitutionDetailChildrenDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => InstitutionDetailContentDto)
  content!: InstitutionDetailContentDto[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsDefined()
  @ValidateNested()
  @Type(() => InstitutionDetailInstitutionDto)
  institution!: InstitutionDetailInstitutionDto;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => InstitutionDetailLeadersDto)
  leaders!: InstitutionDetailLeadersDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => InstitutionDetailLegalBasisDto)
  legalBasis!: InstitutionDetailLegalBasisDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => InstitutionDetailMetricsDto)
  metrics!: InstitutionDetailMetricsDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => InstitutionDetailParentsDto)
  parents!: InstitutionDetailParentsDto[];
}
