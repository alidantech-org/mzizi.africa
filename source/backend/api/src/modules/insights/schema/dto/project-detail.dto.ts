import { Type } from "class-transformer";
import {
  Allow,
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { ProjectDetailEvidenceDto } from "#/modules/insights/schema/dto/project-detail-evidence.dto.ts";
import { ProjectDetailMediaDto } from "#/modules/insights/schema/dto/project-detail-media.dto.ts";
import { ProjectDetailProcurementDto } from "#/modules/insights/schema/dto/project-detail-procurement.dto.ts";
import { ProjectDetailProjectDto } from "#/modules/insights/schema/dto/project-detail-project.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Project Detail
 */
export class ProjectDetailDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ProjectDetailEvidenceDto)
  evidence!: ProjectDetailEvidenceDto[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ProjectDetailMediaDto)
  media!: ProjectDetailMediaDto[];

  @IsArray()
  @Allow()
  money!: unknown[];

  @IsDefined()
  @ValidateNested()
  @Type(() => ProjectDetailProcurementDto)
  procurement!: ProjectDetailProcurementDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => ProjectDetailProjectDto)
  project!: ProjectDetailProjectDto;
}
