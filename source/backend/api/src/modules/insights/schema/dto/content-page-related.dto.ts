import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { ContentPageRelatedCategoryDto } from "#/modules/insights/schema/dto/content-page-related-category.dto.ts";
import { ContentPageRelatedFrontMatterDto } from "#/modules/insights/schema/dto/content-page-related-front-matter.dto.ts";
import { ContentPageRelatedSubjectDto } from "#/modules/insights/schema/dto/content-page-related-subject.dto.ts";
import { InstitutionDetailContentClassificationDto } from "#/modules/insights/schema/dto/institution-detail-content-classification.dto.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Content Page Related
 */
export class ContentPageRelatedDto {
  @IsString()
  body!: String;

  @IsDefined()
  @ValidateNested()
  @Type(() => ContentPageRelatedCategoryDto)
  category!: ContentPageRelatedCategoryDto;

  @IsOptional()
  @ValidateIf((object) => object.classification !== null)
  @ValidateNested()
  @Type(() => InstitutionDetailContentClassificationDto)
  classification?: InstitutionDetailContentClassificationDto | null;

  @IsString()
  code!: String;

  @IsDefined()
  @ValidateNested()
  @Type(() => ContentPageRelatedFrontMatterDto)
  frontMatter!: ContentPageRelatedFrontMatterDto;

  @IsOptional()
  @ValidateIf((object) => object.image !== null)
  @IsString()
  image?: String | null;

  @IsBoolean()
  isDevelopmentText!: Flag;

  @IsString()
  language!: String;

  @IsString()
  slug!: String;

  @IsDefined()
  @ValidateNested()
  @Type(() => ContentPageRelatedSubjectDto)
  subject!: ContentPageRelatedSubjectDto;

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
