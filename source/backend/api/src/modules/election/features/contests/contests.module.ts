import { Module, type Type } from "@nestjs/common";
import { GetElectionUseCase } from "#/modules/election/features/contests/use-cases/get-election.repository.ts";
import { ListElectionsUseCase } from "#/modules/election/features/contests/use-cases/list-elections.repository.ts";
import { ListTalliesUseCase } from "#/modules/election/features/contests/use-cases/list-tallies.repository.ts";

import { ElectionContestsController } from "./contests.controller.ts";
import { ElectionContestsService, ElectionContestsServiceImpl } from "./contests.service.ts";

@Module({
  controllers: [ElectionContestsController],
  providers: [
    {
      provide: ElectionContestsService,
      useClass: ElectionContestsServiceImpl satisfies Type<ElectionContestsService>,
    },
    GetElectionUseCase,
    ListElectionsUseCase,
    ListTalliesUseCase,
  ],
  exports: [ElectionContestsService],
})
export class ElectionContestsModule {}
