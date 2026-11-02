import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SiteCheckEntity } from "#/modules/website/entities/site-check.entity.ts";
import { SiteDomainEntity } from "#/modules/website/entities/site-domain.entity.ts";
import { SitePublisherEntity } from "#/modules/website/entities/site-publisher.entity.ts";
import { SiteEntity } from "#/modules/website/entities/site.entity.ts";
import { StructureFileEntity } from "#/modules/website/entities/structure-file.entity.ts";
import { StructureVersionEntity } from "#/modules/website/entities/structure-version.entity.ts";
import { StructureEntity } from "#/modules/website/entities/structure.entity.ts";
import { WebsiteWebsiteReadServiceImpl } from "#/modules/website/website-read/website-read.service.impl.ts";
import { FindSiteChecksUseCase } from "#/modules/website/website-read/use-cases/find-site-checks.usecase.ts";
import { FindSiteDomainsUseCase } from "#/modules/website/website-read/use-cases/find-site-domains.usecase.ts";
import { FindSitePublishersUseCase } from "#/modules/website/website-read/use-cases/find-site-publishers.usecase.ts";
import { FindSitesUseCase } from "#/modules/website/website-read/use-cases/find-sites.usecase.ts";
import { FindStructureFilesUseCase } from "#/modules/website/website-read/use-cases/find-structure-files.usecase.ts";
import { FindStructureVersionsUseCase } from "#/modules/website/website-read/use-cases/find-structure-versions.usecase.ts";
import { FindStructuresUseCase } from "#/modules/website/website-read/use-cases/find-structures.usecase.ts";
import { GetSiteByIdUseCase } from "#/modules/website/website-read/use-cases/get-site-by-id.usecase.ts";
import { GetSiteCheckByIdUseCase } from "#/modules/website/website-read/use-cases/get-site-check-by-id.usecase.ts";
import { GetSiteDomainByIdUseCase } from "#/modules/website/website-read/use-cases/get-site-domain-by-id.usecase.ts";
import { GetSitePublisherByIdUseCase } from "#/modules/website/website-read/use-cases/get-site-publisher-by-id.usecase.ts";
import { GetStructureByIdUseCase } from "#/modules/website/website-read/use-cases/get-structure-by-id.usecase.ts";
import { GetStructureFileByIdUseCase } from "#/modules/website/website-read/use-cases/get-structure-file-by-id.usecase.ts";
import { GetStructureVersionByIdUseCase } from "#/modules/website/website-read/use-cases/get-structure-version-by-id.usecase.ts";

import { WebsiteWebsiteReadController } from "./website-read.controller.ts";
import { WebsiteWebsiteReadService } from "./website-read.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SiteCheckEntity,
      SiteDomainEntity,
      SitePublisherEntity,
      SiteEntity,
      StructureFileEntity,
      StructureVersionEntity,
      StructureEntity,
    ]),
  ],
  controllers: [WebsiteWebsiteReadController],
  providers: [
    {
      provide: WebsiteWebsiteReadService,
      useClass: WebsiteWebsiteReadServiceImpl satisfies Type<WebsiteWebsiteReadService>,
    },
    FindSiteChecksUseCase,
    FindSiteDomainsUseCase,
    FindSitePublishersUseCase,
    FindSitesUseCase,
    FindStructureFilesUseCase,
    FindStructureVersionsUseCase,
    FindStructuresUseCase,
    GetSiteByIdUseCase,
    GetSiteCheckByIdUseCase,
    GetSiteDomainByIdUseCase,
    GetSitePublisherByIdUseCase,
    GetStructureByIdUseCase,
    GetStructureFileByIdUseCase,
    GetStructureVersionByIdUseCase,
  ],
  exports: [WebsiteWebsiteReadService],
})
export class WebsiteWebsiteReadModule {}