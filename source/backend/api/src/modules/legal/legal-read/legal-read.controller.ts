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
import { LegalAmendmentChangeListQueryDto } from "#/modules/legal/dto/legal-amendment-change-list-query.dto.ts";
import { LegalAmendmentChangeResponseDto } from "#/modules/legal/dto/legal-amendment-change-response.dto.ts";
import { LegalAmendmentChangesListResponseDto } from "#/modules/legal/dto/legal-amendment-changes-list-response.dto.ts";
import { LegalAmendmentListQueryDto } from "#/modules/legal/dto/legal-amendment-list-query.dto.ts";
import { LegalAmendmentResponseDto } from "#/modules/legal/dto/legal-amendment-response.dto.ts";
import { LegalAmendmentsListResponseDto } from "#/modules/legal/dto/legal-amendments-list-response.dto.ts";
import { LegalAuthorityLinkListQueryDto } from "#/modules/legal/dto/legal-authority-link-list-query.dto.ts";
import { LegalAuthorityLinkResponseDto } from "#/modules/legal/dto/legal-authority-link-response.dto.ts";
import { LegalAuthorityLinksListResponseDto } from "#/modules/legal/dto/legal-authority-links-list-response.dto.ts";
import { LegalInstrumentListQueryDto } from "#/modules/legal/dto/legal-instrument-list-query.dto.ts";
import { LegalInstrumentResponseDto } from "#/modules/legal/dto/legal-instrument-response.dto.ts";
import { LegalInstrumentsListResponseDto } from "#/modules/legal/dto/legal-instruments-list-response.dto.ts";
import { LegalProvisionListQueryDto } from "#/modules/legal/dto/legal-provision-list-query.dto.ts";
import { LegalProvisionResponseDto } from "#/modules/legal/dto/legal-provision-response.dto.ts";
import { LegalProvisionsListResponseDto } from "#/modules/legal/dto/legal-provisions-list-response.dto.ts";
import { LegalLegalReadService } from "./legal-read.service.ts";

@Controller()
export class LegalLegalReadController {
  constructor(private readonly service: LegalLegalReadService) {}


  @Get("/v1/legal/amendment-changes")
  @HttpCode(200)
  findLegalAmendmentChanges(
    @Query() input: LegalAmendmentChangeListQueryDto,
  ): Promise<LegalAmendmentChangesListResponseDto> {
    return this.service.findLegalAmendmentChanges(input);
  }


  @Get("/v1/legal/amendments")
  @HttpCode(200)
  findLegalAmendments(
    @Query() input: LegalAmendmentListQueryDto,
  ): Promise<LegalAmendmentsListResponseDto> {
    return this.service.findLegalAmendments(input);
  }


  @Get("/v1/legal/authority-links")
  @HttpCode(200)
  findLegalAuthorityLinks(
    @Query() input: LegalAuthorityLinkListQueryDto,
  ): Promise<LegalAuthorityLinksListResponseDto> {
    return this.service.findLegalAuthorityLinks(input);
  }


  @Get("/v1/legal/instruments")
  @HttpCode(200)
  findLegalInstruments(
    @Query() input: LegalInstrumentListQueryDto,
  ): Promise<LegalInstrumentsListResponseDto> {
    return this.service.findLegalInstruments(input);
  }


  @Get("/v1/legal/provisions")
  @HttpCode(200)
  findLegalProvisions(
    @Query() input: LegalProvisionListQueryDto,
  ): Promise<LegalProvisionsListResponseDto> {
    return this.service.findLegalProvisions(input);
  }


  @Get("/v1/legal/amendments/:amendmentId")
  @HttpCode(200)
  getLegalAmendmentById(
    @Param("amendmentId") amendmentId: string,
  ): Promise<LegalAmendmentResponseDto> {
    return this.service.getLegalAmendmentById({ amendmentId });
  }


  @Get("/v1/legal/amendment-changes/:changeId")
  @HttpCode(200)
  getLegalAmendmentChangeById(
    @Param("changeId") changeId: string,
  ): Promise<LegalAmendmentChangeResponseDto> {
    return this.service.getLegalAmendmentChangeById({ changeId });
  }


  @Get("/v1/legal/authority-links/:linkId")
  @HttpCode(200)
  getLegalAuthorityLinkById(
    @Param("linkId") linkId: string,
  ): Promise<LegalAuthorityLinkResponseDto> {
    return this.service.getLegalAuthorityLinkById({ linkId });
  }


  @Get("/v1/legal/instruments/:instrumentId")
  @HttpCode(200)
  getLegalInstrumentById(
    @Param("instrumentId") instrumentId: string,
  ): Promise<LegalInstrumentResponseDto> {
    return this.service.getLegalInstrumentById({ instrumentId });
  }


  @Get("/v1/legal/provisions/:provisionId")
  @HttpCode(200)
  getLegalProvisionById(
    @Param("provisionId") provisionId: string,
  ): Promise<LegalProvisionResponseDto> {
    return this.service.getLegalProvisionById({ provisionId });
  }
}