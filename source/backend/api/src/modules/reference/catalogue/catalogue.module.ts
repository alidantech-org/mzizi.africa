import { Module, type Type } from "@nestjs/common";
import { ReferenceCatalogueServiceImpl } from "#/modules/reference/catalogue/catalogue.service.impl.ts";
import { BrowseSchemeMembersUseCase } from "#/modules/reference/catalogue/use-cases/browse-scheme-members.usecase.ts";
import { BrowseSchemesUseCase } from "#/modules/reference/catalogue/use-cases/browse-schemes.usecase.ts";
import { LookupMemberUseCase } from "#/modules/reference/catalogue/use-cases/lookup-member.usecase.ts";

import { ReferenceCatalogueController } from "./catalogue.controller.ts";
import { ReferenceCatalogueService } from "./catalogue.service.ts";

@Module({
  controllers: [ReferenceCatalogueController],
  providers: [
    {
      provide: ReferenceCatalogueService,
      useClass: ReferenceCatalogueServiceImpl satisfies Type<ReferenceCatalogueService>,
    },
    BrowseSchemeMembersUseCase,
    BrowseSchemesUseCase,
    LookupMemberUseCase,
  ],
  exports: [ReferenceCatalogueService],
})
export class ReferenceCatalogueModule {}