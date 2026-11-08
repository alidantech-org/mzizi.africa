import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DomainPatternEntity } from "#/modules/website/entities/domain-pattern.entity.ts";
import { SiteCheckEntity } from "#/modules/website/entities/site-check.entity.ts";
import { SiteDomainEntity } from "#/modules/website/entities/site-domain.entity.ts";
import { SiteFamilyEntity } from "#/modules/website/entities/site-family.entity.ts";
import { SiteFingerprintEntity } from "#/modules/website/entities/site-fingerprint.entity.ts";
import { SiteMemberEntity } from "#/modules/website/entities/site-member.entity.ts";
import { SitePublisherEntity } from "#/modules/website/entities/site-publisher.entity.ts";
import { SiteRelationEntity } from "#/modules/website/entities/site-relation.entity.ts";
import { SiteSubjectEntity } from "#/modules/website/entities/site-subject.entity.ts";
import { SiteTraitEntity } from "#/modules/website/entities/site-trait.entity.ts";
import { SiteEntity } from "#/modules/website/entities/site.entity.ts";
import { StructureFileEntity } from "#/modules/website/entities/structure-file.entity.ts";
import { StructureVersionEntity } from "#/modules/website/entities/structure-version.entity.ts";
import { StructureEntity } from "#/modules/website/entities/structure.entity.ts";
import { WebsiteWebsiteReadServiceImpl } from "#/modules/website/website-read/website-read.service.impl.ts";
import { FindDomainPatternsUseCase } from "#/modules/website/website-read/use-cases/find-domain-patterns.usecase.ts";
import { FindSiteChecksUseCase } from "#/modules/website/website-read/use-cases/find-site-checks.usecase.ts";
import { FindSiteDomainsUseCase } from "#/modules/website/website-read/use-cases/find-site-domains.usecase.ts";
import { FindSiteFamiliesUseCase } from "#/modules/website/website-read/use-cases/find-site-families.usecase.ts";
import { FindSiteFingerprintsUseCase } from "#/modules/website/website-read/use-cases/find-site-fingerprints.usecase.ts";
import { FindSiteMembersUseCase } from "#/modules/website/website-read/use-cases/find-site-members.usecase.ts";
import { FindSitePublishersUseCase } from "#/modules/website/website-read/use-cases/find-site-publishers.usecase.ts";
import { FindSiteRelationsUseCase } from "#/modules/website/website-read/use-cases/find-site-relations.usecase.ts";
import { FindSiteSubjectsUseCase } from "#/modules/website/website-read/use-cases/find-site-subjects.usecase.ts";
import { FindSiteTraitsUseCase } from "#/modules/website/website-read/use-cases/find-site-traits.usecase.ts";
import { FindSitesUseCase } from "#/modules/website/website-read/use-cases/find-sites.usecase.ts";
import { FindStructureFilesUseCase } from "#/modules/website/website-read/use-cases/find-structure-files.usecase.ts";
import { FindStructureVersionsUseCase } from "#/modules/website/website-read/use-cases/find-structure-versions.usecase.ts";
import { FindStructuresUseCase } from "#/modules/website/website-read/use-cases/find-structures.usecase.ts";
import { GetDomainPatternByIdUseCase } from "#/modules/website/website-read/use-cases/get-domain-pattern-by-id.usecase.ts";
import { GetSiteByIdUseCase } from "#/modules/website/website-read/use-cases/get-site-by-id.usecase.ts";
import { GetSiteCheckByIdUseCase } from "#/modules/website/website-read/use-cases/get-site-check-by-id.usecase.ts";
import { GetSiteDomainByIdUseCase } from "#/modules/website/website-read/use-cases/get-site-domain-by-id.usecase.ts";
import { GetSiteFamilyByIdUseCase } from "#/modules/website/website-read/use-cases/get-site-family-by-id.usecase.ts";
import { GetSiteFingerprintByIdUseCase } from "#/modules/website/website-read/use-cases/get-site-fingerprint-by-id.usecase.ts";
import { GetSiteMemberByIdUseCase } from "#/modules/website/website-read/use-cases/get-site-member-by-id.usecase.ts";
import { GetSitePublisherByIdUseCase } from "#/modules/website/website-read/use-cases/get-site-publisher-by-id.usecase.ts";
import { GetSiteRelationByIdUseCase } from "#/modules/website/website-read/use-cases/get-site-relation-by-id.usecase.ts";
import { GetSiteSubjectByIdUseCase } from "#/modules/website/website-read/use-cases/get-site-subject-by-id.usecase.ts";
import { GetSiteTraitByIdUseCase } from "#/modules/website/website-read/use-cases/get-site-trait-by-id.usecase.ts";
import { GetStructureByIdUseCase } from "#/modules/website/website-read/use-cases/get-structure-by-id.usecase.ts";
import { GetStructureFileByIdUseCase } from "#/modules/website/website-read/use-cases/get-structure-file-by-id.usecase.ts";
import { GetStructureVersionByIdUseCase } from "#/modules/website/website-read/use-cases/get-structure-version-by-id.usecase.ts";

import { WebsiteWebsiteReadController } from "./website-read.controller.ts";
import { WebsiteWebsiteReadService } from "./website-read.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DomainPatternEntity,
      SiteCheckEntity,
      SiteDomainEntity,
      SiteFamilyEntity,
      SiteFingerprintEntity,
      SiteMemberEntity,
      SitePublisherEntity,
      SiteRelationEntity,
      SiteSubjectEntity,
      SiteTraitEntity,
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
    FindDomainPatternsUseCase,
    FindSiteChecksUseCase,
    FindSiteDomainsUseCase,
    FindSiteFamiliesUseCase,
    FindSiteFingerprintsUseCase,
    FindSiteMembersUseCase,
    FindSitePublishersUseCase,
    FindSiteRelationsUseCase,
    FindSiteSubjectsUseCase,
    FindSiteTraitsUseCase,
    FindSitesUseCase,
    FindStructureFilesUseCase,
    FindStructureVersionsUseCase,
    FindStructuresUseCase,
    GetDomainPatternByIdUseCase,
    GetSiteByIdUseCase,
    GetSiteCheckByIdUseCase,
    GetSiteDomainByIdUseCase,
    GetSiteFamilyByIdUseCase,
    GetSiteFingerprintByIdUseCase,
    GetSiteMemberByIdUseCase,
    GetSitePublisherByIdUseCase,
    GetSiteRelationByIdUseCase,
    GetSiteSubjectByIdUseCase,
    GetSiteTraitByIdUseCase,
    GetStructureByIdUseCase,
    GetStructureFileByIdUseCase,
    GetStructureVersionByIdUseCase,
  ],
  exports: [WebsiteWebsiteReadService],
})
export class WebsiteWebsiteReadModule {}