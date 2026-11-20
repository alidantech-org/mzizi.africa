import { Module, type Type } from "@nestjs/common";
import { ExplorerExplorerRepository } from "#/modules/explorer/features/explorer/repositories/explorer.repository.ts";
import { GetCopyBundleUseCase } from "#/modules/explorer/features/explorer/use-cases/get-copy-bundle.usecase.ts";
import { GetExplorerContextUseCase } from "#/modules/explorer/features/explorer/use-cases/get-explorer-context.usecase.ts";
import { GetExplorerNavigationUseCase } from "#/modules/explorer/features/explorer/use-cases/get-explorer-navigation.usecase.ts";
import { GetExplorerOverviewUseCase } from "#/modules/explorer/features/explorer/use-cases/get-explorer-overview.usecase.ts";
import { GetSetupBootstrapUseCase } from "#/modules/explorer/features/explorer/use-cases/get-setup-bootstrap.usecase.ts";
import { ListExplorerChildrenUseCase } from "#/modules/explorer/features/explorer/use-cases/list-explorer-children.usecase.ts";
import { ResolveExplorerCoordinatesUseCase } from "#/modules/explorer/features/explorer/use-cases/resolve-explorer-coordinates.usecase.ts";
import { SearchExplorerPlacesUseCase } from "#/modules/explorer/features/explorer/use-cases/search-explorer-places.usecase.ts";

import { ExplorerExplorerController } from "./explorer.controller.ts";
import { ExplorerExplorerService, ExplorerExplorerServiceImpl } from "./explorer.service.ts";

@Module({
  controllers: [ExplorerExplorerController],
  providers: [
    {
      provide: ExplorerExplorerService,
      useClass: ExplorerExplorerServiceImpl satisfies Type<ExplorerExplorerService>,
    },
    GetCopyBundleUseCase,
    GetExplorerContextUseCase,
    GetExplorerNavigationUseCase,
    GetExplorerOverviewUseCase,
    GetSetupBootstrapUseCase,
    ListExplorerChildrenUseCase,
    ResolveExplorerCoordinatesUseCase,
    SearchExplorerPlacesUseCase,
    ExplorerExplorerRepository,
  ],
  exports: [ExplorerExplorerService],
})
export class ExplorerExplorerModule {}
