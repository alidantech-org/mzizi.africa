import { Controller, Get, HttpCode, Param, Query } from "@nestjs/common";

import { ArticleCollectionDto } from "#/modules/media/schema/dto/article-collection.dto.ts";
import { ArticleDetailDto } from "#/modules/media/schema/dto/article-detail.dto.ts";
import { IdentityMediaDto } from "#/modules/media/schema/dto/identity-media.dto.ts";
import { UseCollectionDto } from "#/modules/media/schema/dto/use-collection.dto.ts";
import { MediaLibraryService } from "./library.service.ts";

@Controller()
export class MediaLibraryController {
  constructor(private readonly service: MediaLibraryService) {}

  @Get("/v1/media/articles")
  @HttpCode(200)
  listArticles(@Query() input: IdentityMediaDto): Promise<ArticleCollectionDto> {
    return this.service.listArticles(input);
  }

  @Get("/v1/media/assets")
  @HttpCode(200)
  listAssets(@Query() input: IdentityMediaDto): Promise<UseCollectionDto> {
    return this.service.listAssets(input);
  }

  @Get("/v1/media/articles/:code")
  @HttpCode(200)
  getArticle(@Param("code") code: string): Promise<ArticleDetailDto> {
    return this.service.getArticle({ code });
  }
}
