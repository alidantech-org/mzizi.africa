import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AttributionEntity } from "#/modules/source/entities/attribution.entity.ts";
import { CaptureEntity } from "#/modules/source/entities/capture.entity.ts";
import { DocumentEntity } from "#/modules/source/entities/document.entity.ts";
import { MethodEntity } from "#/modules/source/entities/method.entity.ts";
import { PublisherEntity } from "#/modules/source/entities/publisher.entity.ts";
import { VerificationEntity } from "#/modules/source/entities/verification.entity.ts";
import { SourceSourceReadServiceImpl } from "#/modules/source/source-read/source-read.service.impl.ts";
import { FindAttributionsUseCase } from "#/modules/source/source-read/use-cases/find-attributions.usecase.ts";
import { FindCapturesUseCase } from "#/modules/source/source-read/use-cases/find-captures.usecase.ts";
import { FindDocumentsUseCase } from "#/modules/source/source-read/use-cases/find-documents.usecase.ts";
import { FindMethodsUseCase } from "#/modules/source/source-read/use-cases/find-methods.usecase.ts";
import { FindPublishersUseCase } from "#/modules/source/source-read/use-cases/find-publishers.usecase.ts";
import { FindVerificationsUseCase } from "#/modules/source/source-read/use-cases/find-verifications.usecase.ts";
import { GetAttributionByIdUseCase } from "#/modules/source/source-read/use-cases/get-attribution-by-id.usecase.ts";
import { GetCaptureByIdUseCase } from "#/modules/source/source-read/use-cases/get-capture-by-id.usecase.ts";
import { GetDocumentByIdUseCase } from "#/modules/source/source-read/use-cases/get-document-by-id.usecase.ts";
import { GetMethodByIdUseCase } from "#/modules/source/source-read/use-cases/get-method-by-id.usecase.ts";
import { GetPublisherByIdUseCase } from "#/modules/source/source-read/use-cases/get-publisher-by-id.usecase.ts";
import { GetVerificationByIdUseCase } from "#/modules/source/source-read/use-cases/get-verification-by-id.usecase.ts";

import { SourceSourceReadController } from "./source-read.controller.ts";
import { SourceSourceReadService } from "./source-read.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AttributionEntity,
      CaptureEntity,
      DocumentEntity,
      MethodEntity,
      PublisherEntity,
      VerificationEntity,
    ]),
  ],
  controllers: [SourceSourceReadController],
  providers: [
    {
      provide: SourceSourceReadService,
      useClass: SourceSourceReadServiceImpl satisfies Type<SourceSourceReadService>,
    },
    FindAttributionsUseCase,
    FindCapturesUseCase,
    FindDocumentsUseCase,
    FindMethodsUseCase,
    FindPublishersUseCase,
    FindVerificationsUseCase,
    GetAttributionByIdUseCase,
    GetCaptureByIdUseCase,
    GetDocumentByIdUseCase,
    GetMethodByIdUseCase,
    GetPublisherByIdUseCase,
    GetVerificationByIdUseCase,
  ],
  exports: [SourceSourceReadService],
})
export class SourceSourceReadModule {}