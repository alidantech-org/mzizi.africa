import { Module, type Type } from "@nestjs/common";
import { LocalityPlacesRepository } from "#/modules/locality/features/places/repositories/places.repository.ts";
import { BrowseSourcesUseCase } from "#/modules/locality/features/places/use-cases/browse-sources.usecase.ts";
import { GetEvidenceUseCase } from "#/modules/locality/features/places/use-cases/get-evidence.usecase.ts";
import { GetLocalityUseCase } from "#/modules/locality/features/places/use-cases/get-locality.usecase.ts";
import { ListLanguagesUseCase } from "#/modules/locality/features/places/use-cases/list-languages.usecase.ts";
import { ResolveLocalityUseCase } from "#/modules/locality/features/places/use-cases/resolve-locality.usecase.ts";
import { SearchLocalitiesUseCase } from "#/modules/locality/features/places/use-cases/search-localities.usecase.ts";

import { LocalityPlacesController } from "./places.controller.ts";
import { LocalityPlacesService, LocalityPlacesServiceImpl } from "./places.service.ts";

@Module({
  controllers: [LocalityPlacesController],
  providers: [
    {
      provide: LocalityPlacesService,
      useClass: LocalityPlacesServiceImpl satisfies Type<LocalityPlacesService>,
    },
    BrowseSourcesUseCase,
    GetEvidenceUseCase,
    GetLocalityUseCase,
    ListLanguagesUseCase,
    ResolveLocalityUseCase,
    SearchLocalitiesUseCase,
    LocalityPlacesRepository,
  ],
  exports: [LocalityPlacesService],
})
export class LocalityPlacesModule {}
