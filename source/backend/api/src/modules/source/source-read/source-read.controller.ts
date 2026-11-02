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
import { AttributionListQueryDto } from "#/modules/source/dto/attribution-list-query.dto.ts";
import { AttributionResponseDto } from "#/modules/source/dto/attribution-response.dto.ts";
import { AttributionsListResponseDto } from "#/modules/source/dto/attributions-list-response.dto.ts";
import { CaptureListQueryDto } from "#/modules/source/dto/capture-list-query.dto.ts";
import { CaptureResponseDto } from "#/modules/source/dto/capture-response.dto.ts";
import { CapturesListResponseDto } from "#/modules/source/dto/captures-list-response.dto.ts";
import { DocumentListQueryDto } from "#/modules/source/dto/document-list-query.dto.ts";
import { DocumentResponseDto } from "#/modules/source/dto/document-response.dto.ts";
import { DocumentsListResponseDto } from "#/modules/source/dto/documents-list-response.dto.ts";
import { MethodListQueryDto } from "#/modules/source/dto/method-list-query.dto.ts";
import { MethodResponseDto } from "#/modules/source/dto/method-response.dto.ts";
import { MethodsListResponseDto } from "#/modules/source/dto/methods-list-response.dto.ts";
import { PublisherListQueryDto } from "#/modules/source/dto/publisher-list-query.dto.ts";
import { PublisherResponseDto } from "#/modules/source/dto/publisher-response.dto.ts";
import { PublishersListResponseDto } from "#/modules/source/dto/publishers-list-response.dto.ts";
import { VerificationListQueryDto } from "#/modules/source/dto/verification-list-query.dto.ts";
import { VerificationResponseDto } from "#/modules/source/dto/verification-response.dto.ts";
import { VerificationsListResponseDto } from "#/modules/source/dto/verifications-list-response.dto.ts";
import { SourceSourceReadService } from "./source-read.service.ts";

@Controller()
export class SourceSourceReadController {
  constructor(private readonly service: SourceSourceReadService) {}


  @Get("/v1/source/attributions")
  @HttpCode(200)
  findAttributions(
    @Query() input: AttributionListQueryDto,
  ): Promise<AttributionsListResponseDto> {
    return this.service.findAttributions(input);
  }


  @Get("/v1/source/captures")
  @HttpCode(200)
  findCaptures(
    @Query() input: CaptureListQueryDto,
  ): Promise<CapturesListResponseDto> {
    return this.service.findCaptures(input);
  }


  @Get("/v1/source/documents")
  @HttpCode(200)
  findDocuments(
    @Query() input: DocumentListQueryDto,
  ): Promise<DocumentsListResponseDto> {
    return this.service.findDocuments(input);
  }


  @Get("/v1/source/methods")
  @HttpCode(200)
  findMethods(
    @Query() input: MethodListQueryDto,
  ): Promise<MethodsListResponseDto> {
    return this.service.findMethods(input);
  }


  @Get("/v1/source/publishers")
  @HttpCode(200)
  findPublishers(
    @Query() input: PublisherListQueryDto,
  ): Promise<PublishersListResponseDto> {
    return this.service.findPublishers(input);
  }


  @Get("/v1/source/verifications")
  @HttpCode(200)
  findVerifications(
    @Query() input: VerificationListQueryDto,
  ): Promise<VerificationsListResponseDto> {
    return this.service.findVerifications(input);
  }


  @Get("/v1/source/attributions/:attributionId")
  @HttpCode(200)
  getAttributionById(
    @Param("attributionId") attributionId: string,
  ): Promise<AttributionResponseDto> {
    return this.service.getAttributionById({ attributionId });
  }


  @Get("/v1/source/captures/:captureId")
  @HttpCode(200)
  getCaptureById(
    @Param("captureId") captureId: string,
  ): Promise<CaptureResponseDto> {
    return this.service.getCaptureById({ captureId });
  }


  @Get("/v1/source/documents/:documentId")
  @HttpCode(200)
  getDocumentById(
    @Param("documentId") documentId: string,
  ): Promise<DocumentResponseDto> {
    return this.service.getDocumentById({ documentId });
  }


  @Get("/v1/source/methods/:methodId")
  @HttpCode(200)
  getMethodById(
    @Param("methodId") methodId: string,
  ): Promise<MethodResponseDto> {
    return this.service.getMethodById({ methodId });
  }


  @Get("/v1/source/publishers/:publisherId")
  @HttpCode(200)
  getPublisherById(
    @Param("publisherId") publisherId: string,
  ): Promise<PublisherResponseDto> {
    return this.service.getPublisherById({ publisherId });
  }


  @Get("/v1/source/verifications/:verificationId")
  @HttpCode(200)
  getVerificationById(
    @Param("verificationId") verificationId: string,
  ): Promise<VerificationResponseDto> {
    return this.service.getVerificationById({ verificationId });
  }
}