import { Module, type Type } from "@nestjs/common";
import { GetCopyBundleUseCase } from "#/modules/frontend/features/screens/use-cases/get-copy-bundle.repository.ts";
import { GetHomeScreenUseCase } from "#/modules/frontend/features/screens/use-cases/get-home-screen.repository.ts";
import { GetInstitutionScreenUseCase } from "#/modules/frontend/features/screens/use-cases/get-institution-screen.repository.ts";
import { GetPlaceScreenUseCase } from "#/modules/frontend/features/screens/use-cases/get-place-screen.repository.ts";
import { GetRankingScreenUseCase } from "#/modules/frontend/features/screens/use-cases/get-ranking-screen.repository.ts";
import { SearchScreenUseCase } from "#/modules/frontend/features/screens/use-cases/search-screen.repository.ts";

import { FrontendScreensController } from "./screens.controller.ts";
import { FrontendScreensService, FrontendScreensServiceImpl } from "./screens.service.ts";

@Module({
  controllers: [FrontendScreensController],
  providers: [
    {
      provide: FrontendScreensService,
      useClass: FrontendScreensServiceImpl satisfies Type<FrontendScreensService>,
    },
    GetCopyBundleUseCase,
    GetHomeScreenUseCase,
    GetInstitutionScreenUseCase,
    GetPlaceScreenUseCase,
    GetRankingScreenUseCase,
    SearchScreenUseCase,
  ],
  exports: [FrontendScreensService],
})
export class FrontendScreensModule {}
