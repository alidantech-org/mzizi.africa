import { Module, type Type } from "@nestjs/common";
import { GetTenderUseCase } from "#/modules/civic/features/buying/use-cases/get-tender.repository.ts";
import { ListTendersUseCase } from "#/modules/civic/features/buying/use-cases/list-tenders.repository.ts";

import { CivicBuyingController } from "./buying.controller.ts";
import { CivicBuyingService, CivicBuyingServiceImpl } from "./buying.service.ts";

@Module({
  controllers: [CivicBuyingController],
  providers: [
    {
      provide: CivicBuyingService,
      useClass: CivicBuyingServiceImpl satisfies Type<CivicBuyingService>,
    },
    GetTenderUseCase,
    ListTendersUseCase,
  ],
  exports: [CivicBuyingService],
})
export class CivicBuyingModule {}
