import { Injectable } from '@nestjs/common';
import type { AttributionListQueryDto } from '#/modules/source/dto/attribution-list-query.dto';
import type { AttributionResponseDto } from '#/modules/source/dto/attribution-response.dto';
import type { AttributionsListResponseDto } from '#/modules/source/dto/attributions-list-response.dto';
import type { CaptureListQueryDto } from '#/modules/source/dto/capture-list-query.dto';
import type { CaptureResponseDto } from '#/modules/source/dto/capture-response.dto';
import type { CapturesListResponseDto } from '#/modules/source/dto/captures-list-response.dto';
import type { DocumentListQueryDto } from '#/modules/source/dto/document-list-query.dto';
import type { DocumentResponseDto } from '#/modules/source/dto/document-response.dto';
import type { DocumentsListResponseDto } from '#/modules/source/dto/documents-list-response.dto';
import type { MethodListQueryDto } from '#/modules/source/dto/method-list-query.dto';
import type { MethodResponseDto } from '#/modules/source/dto/method-response.dto';
import type { MethodsListResponseDto } from '#/modules/source/dto/methods-list-response.dto';
import type { PublisherListQueryDto } from '#/modules/source/dto/publisher-list-query.dto';
import type { PublisherResponseDto } from '#/modules/source/dto/publisher-response.dto';
import type { PublishersListResponseDto } from '#/modules/source/dto/publishers-list-response.dto';
import type { VerificationListQueryDto } from '#/modules/source/dto/verification-list-query.dto';
import type { VerificationResponseDto } from '#/modules/source/dto/verification-response.dto';
import type { VerificationsListResponseDto } from '#/modules/source/dto/verifications-list-response.dto';
import { FindAttributionsUseCase } from '#/modules/source/source-read/use-cases/find-attributions.usecase';
import { FindCapturesUseCase } from '#/modules/source/source-read/use-cases/find-captures.usecase';
import { FindDocumentsUseCase } from '#/modules/source/source-read/use-cases/find-documents.usecase';
import { FindMethodsUseCase } from '#/modules/source/source-read/use-cases/find-methods.usecase';
import { FindPublishersUseCase } from '#/modules/source/source-read/use-cases/find-publishers.usecase';
import { FindVerificationsUseCase } from '#/modules/source/source-read/use-cases/find-verifications.usecase';
import { GetAttributionByIdUseCase } from '#/modules/source/source-read/use-cases/get-attribution-by-id.usecase';
import { GetCaptureByIdUseCase } from '#/modules/source/source-read/use-cases/get-capture-by-id.usecase';
import { GetDocumentByIdUseCase } from '#/modules/source/source-read/use-cases/get-document-by-id.usecase';
import { GetMethodByIdUseCase } from '#/modules/source/source-read/use-cases/get-method-by-id.usecase';
import { GetPublisherByIdUseCase } from '#/modules/source/source-read/use-cases/get-publisher-by-id.usecase';
import { GetVerificationByIdUseCase } from '#/modules/source/source-read/use-cases/get-verification-by-id.usecase';

/**
 * Source Read: implements the generated SourceSourceReadService contract by
 * delegating to one use case per operation. The feature module binds it to that contract.
 *
 * Scaffolded by Dryv once; this file belongs to the project. New operations need a method here.
 */
@Injectable()
export class SourceSourceReadServiceImpl {
  constructor(
    private readonly findAttributionsUseCase: FindAttributionsUseCase,
    private readonly findCapturesUseCase: FindCapturesUseCase,
    private readonly findDocumentsUseCase: FindDocumentsUseCase,
    private readonly findMethodsUseCase: FindMethodsUseCase,
    private readonly findPublishersUseCase: FindPublishersUseCase,
    private readonly findVerificationsUseCase: FindVerificationsUseCase,
    private readonly getAttributionByIdUseCase: GetAttributionByIdUseCase,
    private readonly getCaptureByIdUseCase: GetCaptureByIdUseCase,
    private readonly getDocumentByIdUseCase: GetDocumentByIdUseCase,
    private readonly getMethodByIdUseCase: GetMethodByIdUseCase,
    private readonly getPublisherByIdUseCase: GetPublisherByIdUseCase,
    private readonly getVerificationByIdUseCase: GetVerificationByIdUseCase,
  ) {}

  /** List attributions. */
  findAttributions(input: AttributionListQueryDto) {
    return this.findAttributionsUseCase.execute(input);
  }

  /** List captures of source documents. */
  findCaptures(input: CaptureListQueryDto) {
    return this.findCapturesUseCase.execute(input);
  }

  /** List source documents. */
  findDocuments(input: DocumentListQueryDto) {
    return this.findDocumentsUseCase.execute(input);
  }

  /** List sourcing methods. */
  findMethods(input: MethodListQueryDto) {
    return this.findMethodsUseCase.execute(input);
  }

  /** List publishers. */
  findPublishers(input: PublisherListQueryDto) {
    return this.findPublishersUseCase.execute(input);
  }

  /** List verifications. */
  findVerifications(input: VerificationListQueryDto) {
    return this.findVerificationsUseCase.execute(input);
  }

  /** Get attributions by id. */
  getAttributionById(input: { attributionId: string }) {
    return this.getAttributionByIdUseCase.execute(input);
  }

  /** Get captures of source documents by id. */
  getCaptureById(input: { captureId: string }) {
    return this.getCaptureByIdUseCase.execute(input);
  }

  /** Get source documents by id. */
  getDocumentById(input: { documentId: string }) {
    return this.getDocumentByIdUseCase.execute(input);
  }

  /** Get sourcing methods by id. */
  getMethodById(input: { methodId: string }) {
    return this.getMethodByIdUseCase.execute(input);
  }

  /** Get publishers by id. */
  getPublisherById(input: { publisherId: string }) {
    return this.getPublisherByIdUseCase.execute(input);
  }

  /** Get verifications by id. */
  getVerificationById(input: { verificationId: string }) {
    return this.getVerificationByIdUseCase.execute(input);
  }
}