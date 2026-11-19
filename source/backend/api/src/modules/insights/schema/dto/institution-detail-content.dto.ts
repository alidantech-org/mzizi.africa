import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsString, IsDefined, ValidateNested } from "class-validator";
import { InstitutionDetailContentCategoryDto } from "#/modules/insights/schema/dto/institution-detail-content-category.dto.ts";
import { InstitutionDetailContentClassificationDto } from "#/modules/insights/schema/dto/institution-detail-content-classification.dto.ts";
import { InstitutionDetailContentFrontMatterDto } from "#/modules/insights/schema/dto/institution-detail-content-front-matter.dto.ts";
import { InstitutionDetailContentSubjectDto } from "#/modules/insights/schema/dto/institution-detail-content-subject.dto.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution Detail Content
 */
export class InstitutionDetailContentDto {
  @IsString()
  body!: String;

  @IsDefined()
  @ValidateNested()
  @Type(() => InstitutionDetailContentCategoryDto)
  category!: InstitutionDetailContentCategoryDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => InstitutionDetailContentClassificationDto)
  classification!: InstitutionDetailContentClassificationDto;

  @IsString()
  code!: String;

  @IsDefined()
  @ValidateNested()
  @Type(() => InstitutionDetailContentFrontMatterDto)
  frontMatter!: InstitutionDetailContentFrontMatterDto;

  @IsString()
  image!: String;

  @IsBoolean()
  isDevelopmentText!: Flag;

  @IsString()
  language!: String;

  @IsString()
  slug!: String;

  @IsDefined()
  @ValidateNested()
  @Type(() => InstitutionDetailContentSubjectDto)
  subject!: InstitutionDetailContentSubjectDto;

  @IsString()
  summary!: String;

  @IsArray()
  @IsString({ each: true })
  tags!: String[];

  @IsString()
  title!: String;

  @IsArray()
  @IsString({ each: true })
  unresolvedMedia!: String[];
}
