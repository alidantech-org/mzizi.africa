import { Module, type Type } from "@nestjs/common";
import { ListCommitmentsUseCase } from "#/modules/politics/features/promises/use-cases/list-commitments.repository.ts";

import { PoliticsPromisesController } from "./promises.controller.ts";
import { PoliticsPromisesService, PoliticsPromisesServiceImpl } from "./promises.service.ts";

@Module({
  controllers: [PoliticsPromisesController],
  providers: [
    {
      provide: PoliticsPromisesService,
      useClass: PoliticsPromisesServiceImpl satisfies Type<PoliticsPromisesService>,
    },
    ListCommitmentsUseCase,
  ],
  exports: [PoliticsPromisesService],
})
export class PoliticsPromisesModule {}
