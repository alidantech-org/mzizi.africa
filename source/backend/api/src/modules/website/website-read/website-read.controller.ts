import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  ParseBoolPipe,
  ParseFloatPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";

import { Cookie } from "#/modules/common/server/http/cookie.decorator.ts";
import { SiteCheckListQueryDto } from "#/modules/website/dto/site-check-list-query.dto.ts";
import { SiteCheckResponseDto } from "#/modules/website/dto/site-check-response.dto.ts";
import { SiteChecksListResponseDto } from "#/modules/website/dto/site-checks-list-response.dto.ts";
import { SiteDomainListQueryDto } from "#/modules/website/dto/site-domain-list-query.dto.ts";
import { SiteDomainResponseDto } from "#/modules/website/dto/site-domain-response.dto.ts";
import { SiteDomainsListResponseDto } from "#/modules/website/dto/site-domains-list-response.dto.ts";
import { SiteListQueryDto } from "#/modules/website/dto/site-list-query.dto.ts";
import { SitePublisherListQueryDto } from "#/modules/website/dto/site-publisher-list-query.dto.ts";
import { SitePublisherResponseDto } from "#/modules/website/dto/site-publisher-response.dto.ts";
import { SitePublishersListResponseDto } from "#/modules/website/dto/site-publishers-list-response.dto.ts";
import { SiteResponseDto } from "#/modules/website/dto/site-response.dto.ts";
import { SitesListResponseDto } from "#/modules/website/dto/sites-list-response.dto.ts";
import { StructureFileListQueryDto } from "#/modules/website/dto/structure-file-list-query.dto.ts";
import { StructureFileResponseDto } from "#/modules/website/dto/structure-file-response.dto.ts";
import { StructureFilesListResponseDto } from "#/modules/website/dto/structure-files-list-response.dto.ts";
import { StructureListQueryDto } from "#/modules/website/dto/structure-list-query.dto.ts";
import { StructureResponseDto } from "#/modules/website/dto/structure-response.dto.ts";
import { StructureVersionListQueryDto } from "#/modules/website/dto/structure-version-list-query.dto.ts";
import { StructureVersionResponseDto } from "#/modules/website/dto/structure-version-response.dto.ts";
import { StructureVersionsListResponseDto } from "#/modules/website/dto/structure-versions-list-response.dto.ts";
import { StructuresListResponseDto } from "#/modules/website/dto/structures-list-response.dto.ts";
import { WebsiteWebsiteReadService } from "./website-read.service.ts";

@Controller()
export class WebsiteWebsiteReadController {
  constructor(private readonly service: WebsiteWebsiteReadService) {}


  @Get("/v1/website/checks")
  @HttpCode(200)
  findSiteChecks(
    @Query() input: SiteCheckListQueryDto,
  ): Promise<SiteChecksListResponseDto> {
    return this.service.findSiteChecks(input);
  }


  @Get("/v1/website/domains")
  @HttpCode(200)
  findSiteDomains(
    @Query() input: SiteDomainListQueryDto,
  ): Promise<SiteDomainsListResponseDto> {
    return this.service.findSiteDomains(input);
  }


  @Get("/v1/website/site-publishers")
  @HttpCode(200)
  findSitePublishers(
    @Query() input: SitePublisherListQueryDto,
  ): Promise<SitePublishersListResponseDto> {
    return this.service.findSitePublishers(input);
  }


  @Get("/v1/website/sites")
  @HttpCode(200)
  findSites(
    @Query() input: SiteListQueryDto,
  ): Promise<SitesListResponseDto> {
    return this.service.findSites(input);
  }


  @Get("/v1/website/structure-files")
  @HttpCode(200)
  findStructureFiles(
    @Query() input: StructureFileListQueryDto,
  ): Promise<StructureFilesListResponseDto> {
    return this.service.findStructureFiles(input);
  }


  @Get("/v1/website/structure-versions")
  @HttpCode(200)
  findStructureVersions(
    @Query() input: StructureVersionListQueryDto,
  ): Promise<StructureVersionsListResponseDto> {
    return this.service.findStructureVersions(input);
  }


  @Get("/v1/website/structures")
  @HttpCode(200)
  findStructures(
    @Query() input: StructureListQueryDto,
  ): Promise<StructuresListResponseDto> {
    return this.service.findStructures(input);
  }


  @Get("/v1/website/sites/:siteId")
  @HttpCode(200)
  getSiteById(
    @Param("siteId") siteId: string,
  ): Promise<SiteResponseDto> {
    return this.service.getSiteById({ siteId });
  }


  @Get("/v1/website/checks/:siteCheckId")
  @HttpCode(200)
  getSiteCheckById(
    @Param("siteCheckId") siteCheckId: string,
  ): Promise<SiteCheckResponseDto> {
    return this.service.getSiteCheckById({ siteCheckId });
  }


  @Get("/v1/website/domains/:domainId")
  @HttpCode(200)
  getSiteDomainById(
    @Param("domainId") domainId: string,
  ): Promise<SiteDomainResponseDto> {
    return this.service.getSiteDomainById({ domainId });
  }


  @Get("/v1/website/site-publishers/:sitePublisherId")
  @HttpCode(200)
  getSitePublisherById(
    @Param("sitePublisherId") sitePublisherId: string,
  ): Promise<SitePublisherResponseDto> {
    return this.service.getSitePublisherById({ sitePublisherId });
  }


  @Get("/v1/website/structures/:structureId")
  @HttpCode(200)
  getStructureById(
    @Param("structureId") structureId: string,
  ): Promise<StructureResponseDto> {
    return this.service.getStructureById({ structureId });
  }


  @Get("/v1/website/structure-files/:structureFileId")
  @HttpCode(200)
  getStructureFileById(
    @Param("structureFileId") structureFileId: string,
  ): Promise<StructureFileResponseDto> {
    return this.service.getStructureFileById({ structureFileId });
  }


  @Get("/v1/website/structure-versions/:structureVersionId")
  @HttpCode(200)
  getStructureVersionById(
    @Param("structureVersionId") structureVersionId: string,
  ): Promise<StructureVersionResponseDto> {
    return this.service.getStructureVersionById({ structureVersionId });
  }
}