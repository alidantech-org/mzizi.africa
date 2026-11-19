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
import { ContentPageContentCategoryDto } from "#/modules/insights/schema/dto/content-page-content-category.dto.ts";
import { ContentPageContentFrontMatterDto } from "#/modules/insights/schema/dto/content-page-content-front-matter.dto.ts";
import { ContentPageContentSubjectDto } from "#/modules/insights/schema/dto/content-page-content-subject.dto.ts";
import { InstitutionDetailContentClassificationDto } from "#/modules/insights/schema/dto/institution-detail-content-classification.dto.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Content Page Content
 */
export class ContentPageContentDto {
  @IsString()
  body!: String;

  @IsDefined()
  @ValidateNested()
  @Type(() => ContentPageContentCategoryDto)
  category!: ContentPageContentCategoryDto;

  @IsOptional()
  @ValidateIf((object) => object.classification !== null)
  @ValidateNested()
  @Type(() => InstitutionDetailContentClassificationDto)
  classification?: InstitutionDetailContentClassificationDto | null;

  @IsString()
  code!: String;

  @IsDefined()
  @ValidateNested()
  @Type(() => ContentPageContentFrontMatterDto)
  frontMatter!: ContentPageContentFrontMatterDto;

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
  @Type(() => ContentPageContentSubjectDto)
  subject!: ContentPageContentSubjectDto;

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
