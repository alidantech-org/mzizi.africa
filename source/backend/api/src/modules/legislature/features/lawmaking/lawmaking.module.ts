import { Module, type Type } from "@nestjs/common";
import { GetBillUseCase } from "#/modules/legislature/features/lawmaking/use-cases/get-bill.repository.ts";
import { ListBillsUseCase } from "#/modules/legislature/features/lawmaking/use-cases/list-bills.repository.ts";
import { ListVotesUseCase } from "#/modules/legislature/features/lawmaking/use-cases/list-votes.repository.ts";

import { LegislatureLawmakingController } from "./lawmaking.controller.ts";
import {
  LegislatureLawmakingService,
  LegislatureLawmakingServiceImpl,
} from "./lawmaking.service.ts";

@Module({
  controllers: [LegislatureLawmakingController],
  providers: [
    {
      provide: LegislatureLawmakingService,
      useClass: LegislatureLawmakingServiceImpl satisfies Type<LegislatureLawmakingService>,
    },
    GetBillUseCase,
    ListBillsUseCase,
    ListVotesUseCase,
  ],
  exports: [LegislatureLawmakingService],
})
export class LegislatureLawmakingModule {}
