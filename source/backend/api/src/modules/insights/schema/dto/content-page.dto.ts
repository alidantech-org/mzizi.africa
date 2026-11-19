import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { ContentPageContentDto } from "#/modules/insights/schema/dto/content-page-content.dto.ts";
import { ContentPageRelatedDto } from "#/modules/insights/schema/dto/content-page-related.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Content Page
 */
export class ContentPageDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => ContentPageContentDto)
  content!: ContentPageContentDto;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ContentPageRelatedDto)
  related!: ContentPageRelatedDto[];
}
