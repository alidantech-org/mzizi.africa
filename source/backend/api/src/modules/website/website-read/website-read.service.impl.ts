import { Injectable } from '@nestjs/common';
import type { SiteCheckListQueryDto } from '#/modules/website/dto/site-check-list-query.dto';
import type { SiteCheckResponseDto } from '#/modules/website/dto/site-check-response.dto';
import type { SiteChecksListResponseDto } from '#/modules/website/dto/site-checks-list-response.dto';
import type { SiteDomainListQueryDto } from '#/modules/website/dto/site-domain-list-query.dto';
import type { SiteDomainResponseDto } from '#/modules/website/dto/site-domain-response.dto';
import type { SiteDomainsListResponseDto } from '#/modules/website/dto/site-domains-list-response.dto';
import type { SiteListQueryDto } from '#/modules/website/dto/site-list-query.dto';
import type { SitePublisherListQueryDto } from '#/modules/website/dto/site-publisher-list-query.dto';
import type { SitePublisherResponseDto } from '#/modules/website/dto/site-publisher-response.dto';
import type { SitePublishersListResponseDto } from '#/modules/website/dto/site-publishers-list-response.dto';
import type { SiteResponseDto } from '#/modules/website/dto/site-response.dto';
import type { SitesListResponseDto } from '#/modules/website/dto/sites-list-response.dto';
import type { StructureFileListQueryDto } from '#/modules/website/dto/structure-file-list-query.dto';
import type { StructureFileResponseDto } from '#/modules/website/dto/structure-file-response.dto';
import type { StructureFilesListResponseDto } from '#/modules/website/dto/structure-files-list-response.dto';
import type { StructureListQueryDto } from '#/modules/website/dto/structure-list-query.dto';
import type { StructureResponseDto } from '#/modules/website/dto/structure-response.dto';
import type { StructureVersionListQueryDto } from '#/modules/website/dto/structure-version-list-query.dto';
import type { StructureVersionResponseDto } from '#/modules/website/dto/structure-version-response.dto';
import type { StructureVersionsListResponseDto } from '#/modules/website/dto/structure-versions-list-response.dto';
import type { StructuresListResponseDto } from '#/modules/website/dto/structures-list-response.dto';
import { FindSiteChecksUseCase } from '#/modules/website/website-read/use-cases/find-site-checks.usecase';
import { FindSiteDomainsUseCase } from '#/modules/website/website-read/use-cases/find-site-domains.usecase';
import { FindSitePublishersUseCase } from '#/modules/website/website-read/use-cases/find-site-publishers.usecase';
import { FindSitesUseCase } from '#/modules/website/website-read/use-cases/find-sites.usecase';
import { FindStructureFilesUseCase } from '#/modules/website/website-read/use-cases/find-structure-files.usecase';
import { FindStructureVersionsUseCase } from '#/modules/website/website-read/use-cases/find-structure-versions.usecase';
import { FindStructuresUseCase } from '#/modules/website/website-read/use-cases/find-structures.usecase';
import { GetSiteByIdUseCase } from '#/modules/website/website-read/use-cases/get-site-by-id.usecase';
import { GetSiteCheckByIdUseCase } from '#/modules/website/website-read/use-cases/get-site-check-by-id.usecase';
import { GetSiteDomainByIdUseCase } from '#/modules/website/website-read/use-cases/get-site-domain-by-id.usecase';
import { GetSitePublisherByIdUseCase } from '#/modules/website/website-read/use-cases/get-site-publisher-by-id.usecase';
import { GetStructureByIdUseCase } from '#/modules/website/website-read/use-cases/get-structure-by-id.usecase';
import { GetStructureFileByIdUseCase } from '#/modules/website/website-read/use-cases/get-structure-file-by-id.usecase';
import { GetStructureVersionByIdUseCase } from '#/modules/website/website-read/use-cases/get-structure-version-by-id.usecase';

/**
 * Website Read: implements the generated WebsiteWebsiteReadService contract by
 * delegating to one use case per operation. The feature module binds it to that contract.
 *
 * Scaffolded by Dryv once; this file belongs to the project. New operations need a method here.
 */
@Injectable()
export class WebsiteWebsiteReadServiceImpl {
  constructor(
    private readonly findSiteChecksUseCase: FindSiteChecksUseCase,
    private readonly findSiteDomainsUseCase: FindSiteDomainsUseCase,
    private readonly findSitePublishersUseCase: FindSitePublishersUseCase,
    private readonly findSitesUseCase: FindSitesUseCase,
    private readonly findStructureFilesUseCase: FindStructureFilesUseCase,
    private readonly findStructureVersionsUseCase: FindStructureVersionsUseCase,
    private readonly findStructuresUseCase: FindStructuresUseCase,
    private readonly getSiteByIdUseCase: GetSiteByIdUseCase,
    private readonly getSiteCheckByIdUseCase: GetSiteCheckByIdUseCase,
    private readonly getSiteDomainByIdUseCase: GetSiteDomainByIdUseCase,
    private readonly getSitePublisherByIdUseCase: GetSitePublisherByIdUseCase,
    private readonly getStructureByIdUseCase: GetStructureByIdUseCase,
    private readonly getStructureFileByIdUseCase: GetStructureFileByIdUseCase,
    private readonly getStructureVersionByIdUseCase: GetStructureVersionByIdUseCase,
  ) {}

  /** List site checks. */
  findSiteChecks(input: SiteCheckListQueryDto) {
    return this.findSiteChecksUseCase.execute(input);
  }

  /** List site domains. */
  findSiteDomains(input: SiteDomainListQueryDto) {
    return this.findSiteDomainsUseCase.execute(input);
  }

  /** List site and publisher links. */
  findSitePublishers(input: SitePublisherListQueryDto) {
    return this.findSitePublishersUseCase.execute(input);
  }

  /** List known sites. */
  findSites(input: SiteListQueryDto) {
    return this.findSitesUseCase.execute(input);
  }

  /** List files of structure versions. */
  findStructureFiles(input: StructureFileListQueryDto) {
    return this.findStructureFilesUseCase.execute(input);
  }

  /** List structure versions. */
  findStructureVersions(input: StructureVersionListQueryDto) {
    return this.findStructureVersionsUseCase.execute(input);
  }

  /** List site structures. */
  findStructures(input: StructureListQueryDto) {
    return this.findStructuresUseCase.execute(input);
  }

  /** Get known sites by id. */
  getSiteById(input: { siteId: string }) {
    return this.getSiteByIdUseCase.execute(input);
  }

  /** Get site checks by id. */
  getSiteCheckById(input: { siteCheckId: string }) {
    return this.getSiteCheckByIdUseCase.execute(input);
  }

  /** Get site domains by id. */
  getSiteDomainById(input: { domainId: string }) {
    return this.getSiteDomainByIdUseCase.execute(input);
  }

  /** Get site and publisher links by id. */
  getSitePublisherById(input: { sitePublisherId: string }) {
    return this.getSitePublisherByIdUseCase.execute(input);
  }

  /** Get site structures by id. */
  getStructureById(input: { structureId: string }) {
    return this.getStructureByIdUseCase.execute(input);
  }

  /** Get files of structure versions by id. */
  getStructureFileById(input: { structureFileId: string }) {
    return this.getStructureFileByIdUseCase.execute(input);
  }

  /** Get structure versions by id. */
  getStructureVersionById(input: { structureVersionId: string }) {
    return this.getStructureVersionByIdUseCase.execute(input);
  }
}