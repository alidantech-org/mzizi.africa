import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { ContentListCategoriesDto } from "#/modules/insights/schema/dto/content-list-categories.dto.ts";
import { ContentListItemsDto } from "#/modules/insights/schema/dto/content-list-items.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Content List
 */
export class ContentListDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ContentListCategoriesDto)
  categories!: ContentListCategoriesDto[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ContentListItemsDto)
  items!: ContentListItemsDto[];
}
