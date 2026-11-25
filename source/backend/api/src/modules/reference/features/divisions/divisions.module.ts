import { Module, type Type } from "@nestjs/common";
import { ListHierarchiesUseCase } from "#/modules/reference/features/divisions/use-cases/list-hierarchies.repository.ts";

import { ReferenceDivisionsController } from "./divisions.controller.ts";
import { ReferenceDivisionsService, ReferenceDivisionsServiceImpl } from "./divisions.service.ts";

@Module({
  controllers: [ReferenceDivisionsController],
  providers: [
    {
      provide: ReferenceDivisionsService,
      useClass: ReferenceDivisionsServiceImpl satisfies Type<ReferenceDivisionsService>,
    },
    ListHierarchiesUseCase,
  ],
  exports: [ReferenceDivisionsService],
})
export class ReferenceDivisionsModule {}
