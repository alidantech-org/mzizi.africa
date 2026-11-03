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
import { GeographyGovernanceResponseDto } from "#/modules/governance/dto/geography-governance-response.dto.ts";
import { InstitutionListQueryDto } from "#/modules/governance/dto/institution-list-query.dto.ts";
import { InstitutionRelationshipListQueryDto } from "#/modules/governance/dto/institution-relationship-list-query.dto.ts";
import { InstitutionRelationshipResponseDto } from "#/modules/governance/dto/institution-relationship-response.dto.ts";
import { InstitutionRelationshipsListResponseDto } from "#/modules/governance/dto/institution-relationships-list-response.dto.ts";
import { InstitutionResponseDto } from "#/modules/governance/dto/institution-response.dto.ts";
import { InstitutionsListResponseDto } from "#/modules/governance/dto/institutions-list-response.dto.ts";
import { OfficeHolderListQueryDto } from "#/modules/governance/dto/office-holder-list-query.dto.ts";
import { OfficeHolderResponseDto } from "#/modules/governance/dto/office-holder-response.dto.ts";
import { OfficeHolderSearchQueryDto } from "#/modules/governance/dto/office-holder-search-query.dto.ts";
import { OfficeHolderSearchResponseDto } from "#/modules/governance/dto/office-holder-search-response.dto.ts";
import { OfficeHoldersListResponseDto } from "#/modules/governance/dto/office-holders-list-response.dto.ts";
import { OfficeListQueryDto } from "#/modules/governance/dto/office-list-query.dto.ts";
import { OfficeResponseDto } from "#/modules/governance/dto/office-response.dto.ts";
import { OfficeRuleListQueryDto } from "#/modules/governance/dto/office-rule-list-query.dto.ts";
import { OfficeRuleResponseDto } from "#/modules/governance/dto/office-rule-response.dto.ts";
import { OfficeRulesListResponseDto } from "#/modules/governance/dto/office-rules-list-response.dto.ts";
import { OfficesListResponseDto } from "#/modules/governance/dto/offices-list-response.dto.ts";
import { SelectionProcedureListQueryDto } from "#/modules/governance/dto/selection-procedure-list-query.dto.ts";
import { SelectionProcedureResponseDto } from "#/modules/governance/dto/selection-procedure-response.dto.ts";
import { SelectionProceduresListResponseDto } from "#/modules/governance/dto/selection-procedures-list-response.dto.ts";
import { SelectionStageListQueryDto } from "#/modules/governance/dto/selection-stage-list-query.dto.ts";
import { SelectionStageResponseDto } from "#/modules/governance/dto/selection-stage-response.dto.ts";
import { SelectionStagesListResponseDto } from "#/modules/governance/dto/selection-stages-list-response.dto.ts";
import { GovernanceGovernanceReadService } from "./governance-read.service.ts";

@Controller()
export class GovernanceGovernanceReadController {
  constructor(private readonly service: GovernanceGovernanceReadService) {}


  @Get("/v1/governance/institution-relationships")
  @HttpCode(200)
  findInstitutionRelationships(
    @Query() input: InstitutionRelationshipListQueryDto,
  ): Promise<InstitutionRelationshipsListResponseDto> {
    return this.service.findInstitutionRelationships(input);
  }


  @Get("/v1/governance/institutions")
  @HttpCode(200)
  findInstitutions(
    @Query() input: InstitutionListQueryDto,
  ): Promise<InstitutionsListResponseDto> {
    return this.service.findInstitutions(input);
  }


  @Get("/v1/governance/office-holders")
  @HttpCode(200)
  findOfficeHolders(
    @Query() input: OfficeHolderListQueryDto,
  ): Promise<OfficeHoldersListResponseDto> {
    return this.service.findOfficeHolders(input);
  }


  @Get("/v1/governance/office-rules")
  @HttpCode(200)
  findOfficeRules(
    @Query() input: OfficeRuleListQueryDto,
  ): Promise<OfficeRulesListResponseDto> {
    return this.service.findOfficeRules(input);
  }


  @Get("/v1/governance/offices")
  @HttpCode(200)
  findOffices(
    @Query() input: OfficeListQueryDto,
  ): Promise<OfficesListResponseDto> {
    return this.service.findOffices(input);
  }


  @Get("/v1/governance/selection-procedures")
  @HttpCode(200)
  findSelectionProcedures(
    @Query() input: SelectionProcedureListQueryDto,
  ): Promise<SelectionProceduresListResponseDto> {
    return this.service.findSelectionProcedures(input);
  }


  @Get("/v1/governance/selection-stages")
  @HttpCode(200)
  findSelectionStages(
    @Query() input: SelectionStageListQueryDto,
  ): Promise<SelectionStagesListResponseDto> {
    return this.service.findSelectionStages(input);
  }


  @Get("/v1/governance/office-holders/search")
  @HttpCode(200)
  searchOfficeHolders(
    @Query() input: OfficeHolderSearchQueryDto,
  ): Promise<OfficeHolderSearchResponseDto> {
    return this.service.searchOfficeHolders(input);
  }


  @Get("/v1/geography/entities/:entityId/governance")
  @HttpCode(200)
  getGeographyGovernance(
    @Param("entityId") entityId: string,
  ): Promise<GeographyGovernanceResponseDto> {
    return this.service.getGeographyGovernance({ entityId });
  }


  @Get("/v1/governance/institutions/:institutionId")
  @HttpCode(200)
  getInstitutionById(
    @Param("institutionId") institutionId: string,
  ): Promise<InstitutionResponseDto> {
    return this.service.getInstitutionById({ institutionId });
  }


  @Get("/v1/governance/institution-relationships/:relationshipId")
  @HttpCode(200)
  getInstitutionRelationshipById(
    @Param("relationshipId") relationshipId: string,
  ): Promise<InstitutionRelationshipResponseDto> {
    return this.service.getInstitutionRelationshipById({ relationshipId });
  }


  @Get("/v1/governance/offices/:officeId")
  @HttpCode(200)
  getOfficeById(
    @Param("officeId") officeId: string,
  ): Promise<OfficeResponseDto> {
    return this.service.getOfficeById({ officeId });
  }


  @Get("/v1/governance/office-holders/:holderId")
  @HttpCode(200)
  getOfficeHolderById(
    @Param("holderId") holderId: string,
  ): Promise<OfficeHolderResponseDto> {
    return this.service.getOfficeHolderById({ holderId });
  }


  @Get("/v1/governance/office-rules/:ruleId")
  @HttpCode(200)
  getOfficeRuleById(
    @Param("ruleId") ruleId: string,
  ): Promise<OfficeRuleResponseDto> {
    return this.service.getOfficeRuleById({ ruleId });
  }


  @Get("/v1/governance/selection-procedures/:procedureId")
  @HttpCode(200)
  getSelectionProcedureById(
    @Param("procedureId") procedureId: string,
  ): Promise<SelectionProcedureResponseDto> {
    return this.service.getSelectionProcedureById({ procedureId });
  }


  @Get("/v1/governance/selection-stages/:stageId")
  @HttpCode(200)
  getSelectionStageById(
    @Param("stageId") stageId: string,
  ): Promise<SelectionStageResponseDto> {
    return this.service.getSelectionStageById({ stageId });
  }
}