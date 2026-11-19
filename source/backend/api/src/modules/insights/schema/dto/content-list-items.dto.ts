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
import { ContentListItemsCategoryDto } from "#/modules/insights/schema/dto/content-list-items-category.dto.ts";
import { ContentListItemsClassificationDto } from "#/modules/insights/schema/dto/content-list-items-classification.dto.ts";
import { ContentListItemsFrontMatterDto } from "#/modules/insights/schema/dto/content-list-items-front-matter.dto.ts";
import { ContentListItemsSubjectDto } from "#/modules/insights/schema/dto/content-list-items-subject.dto.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Content List Items
 */
export class ContentListItemsDto {
  @IsString()
  body!: String;

  @IsDefined()
  @ValidateNested()
  @Type(() => ContentListItemsCategoryDto)
  category!: ContentListItemsCategoryDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => ContentListItemsClassificationDto)
  classification!: ContentListItemsClassificationDto;

  @IsString()
  code!: String;

  @IsDefined()
  @ValidateNested()
  @Type(() => ContentListItemsFrontMatterDto)
  frontMatter!: ContentListItemsFrontMatterDto;

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
  @Type(() => ContentListItemsSubjectDto)
  subject!: ContentListItemsSubjectDto;

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
