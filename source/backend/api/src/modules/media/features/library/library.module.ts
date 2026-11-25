import { Module, type Type } from "@nestjs/common";
import { GetArticleUseCase } from "#/modules/media/features/library/use-cases/get-article.repository.ts";
import { ListArticlesUseCase } from "#/modules/media/features/library/use-cases/list-articles.repository.ts";
import { ListAssetsUseCase } from "#/modules/media/features/library/use-cases/list-assets.repository.ts";

import { MediaLibraryController } from "./library.controller.ts";
import { MediaLibraryService, MediaLibraryServiceImpl } from "./library.service.ts";

@Module({
  controllers: [MediaLibraryController],
  providers: [
    {
      provide: MediaLibraryService,
      useClass: MediaLibraryServiceImpl satisfies Type<MediaLibraryService>,
    },
    GetArticleUseCase,
    ListArticlesUseCase,
    ListAssetsUseCase,
  ],
  exports: [MediaLibraryService],
})
export class MediaLibraryModule {}
