import { Module, type Type } from "@nestjs/common";
import { GetPartyUseCase } from "#/modules/politics/features/parties/use-cases/get-party.repository.ts";
import { ListPartiesUseCase } from "#/modules/politics/features/parties/use-cases/list-parties.repository.ts";

import { PoliticsPartiesController } from "./parties.controller.ts";
import { PoliticsPartiesService, PoliticsPartiesServiceImpl } from "./parties.service.ts";

@Module({
  controllers: [PoliticsPartiesController],
  providers: [
    {
      provide: PoliticsPartiesService,
      useClass: PoliticsPartiesServiceImpl satisfies Type<PoliticsPartiesService>,
    },
    GetPartyUseCase,
    ListPartiesUseCase,
  ],
  exports: [PoliticsPartiesService],
})
export class PoliticsPartiesModule {}
