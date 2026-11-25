import { Module, type Type } from "@nestjs/common";
import { ListCurrenciesUseCase } from "#/modules/reference/features/measures/use-cases/list-currencies.repository.ts";
import { ListUnitsUseCase } from "#/modules/reference/features/measures/use-cases/list-units.repository.ts";

import { ReferenceMeasuresController } from "./measures.controller.ts";
import { ReferenceMeasuresService, ReferenceMeasuresServiceImpl } from "./measures.service.ts";

@Module({
  controllers: [ReferenceMeasuresController],
  providers: [
    {
      provide: ReferenceMeasuresService,
      useClass: ReferenceMeasuresServiceImpl satisfies Type<ReferenceMeasuresService>,
    },
    ListCurrenciesUseCase,
    ListUnitsUseCase,
  ],
  exports: [ReferenceMeasuresService],
})
export class ReferenceMeasuresModule {}
