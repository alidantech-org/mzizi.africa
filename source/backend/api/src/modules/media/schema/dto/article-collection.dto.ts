import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { ArticleEntryDto } from "#/modules/media/schema/dto/article-entry.dto.ts";

/**
 * Article Collection
 */
export class ArticleCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ArticleEntryDto)
  articles!: ArticleEntryDto[];
}
