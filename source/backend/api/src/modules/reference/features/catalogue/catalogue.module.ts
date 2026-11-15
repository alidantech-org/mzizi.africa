import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SchemeEntity } from "#/modules/reference/schema/entities/scheme.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { ReferenceCatalogueRepository } from "#/modules/reference/features/catalogue/repositories/catalogue.repository.ts";
import { BrowseSchemeMembersUseCase } from "#/modules/reference/features/catalogue/use-cases/browse-scheme-members.usecase.ts";
import { BrowseSchemesUseCase } from "#/modules/reference/features/catalogue/use-cases/browse-schemes.usecase.ts";
import { LookupMemberUseCase } from "#/modules/reference/features/catalogue/use-cases/lookup-member.usecase.ts";

import { ReferenceCatalogueController } from "./catalogue.controller.ts";
import { ReferenceCatalogueService, ReferenceCatalogueServiceImpl } from "./catalogue.service.ts";

@Module({
  imports: [TypeOrmModule.forFeature([SchemeEntity, ValueEntity])],
  controllers: [ReferenceCatalogueController],
  providers: [
    {
      provide: ReferenceCatalogueService,
      useClass: ReferenceCatalogueServiceImpl satisfies Type<ReferenceCatalogueService>,
    },
    BrowseSchemeMembersUseCase,
    BrowseSchemesUseCase,
    LookupMemberUseCase,
    ReferenceCatalogueRepository,
  ],
  exports: [ReferenceCatalogueService],
})
export class ReferenceCatalogueModule {}
