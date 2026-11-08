import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentEntity } from "#/modules/audit/entities/comment.entity.ts";
import { EvidenceReferenceEntity } from "#/modules/audit/entities/evidence-reference.entity.ts";
import { ReviewDecisionEntity } from "#/modules/audit/entities/review-decision.entity.ts";
import { AuditAuditServiceImpl } from "#/modules/audit/audit/audit.service.impl.ts";
import { CreateCommentUseCase } from "#/modules/audit/audit/use-cases/create-comment.usecase.ts";
import { CreateEvidenceReferenceUseCase } from "#/modules/audit/audit/use-cases/create-evidence-reference.usecase.ts";
import { CreateReviewDecisionUseCase } from "#/modules/audit/audit/use-cases/create-review-decision.usecase.ts";
import { FindCommentsUseCase } from "#/modules/audit/audit/use-cases/find-comments.usecase.ts";
import { FindEvidenceReferencesUseCase } from "#/modules/audit/audit/use-cases/find-evidence-references.usecase.ts";
import { FindReviewDecisionsUseCase } from "#/modules/audit/audit/use-cases/find-review-decisions.usecase.ts";
import { GetCommentByIdUseCase } from "#/modules/audit/audit/use-cases/get-comment-by-id.usecase.ts";
import { GetEvidenceReferenceByIdUseCase } from "#/modules/audit/audit/use-cases/get-evidence-reference-by-id.usecase.ts";
import { GetReviewDecisionByIdUseCase } from "#/modules/audit/audit/use-cases/get-review-decision-by-id.usecase.ts";

import { AuditAuditController } from "./audit.controller.ts";
import { AuditAuditService } from "./audit.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentEntity,
      EvidenceReferenceEntity,
      ReviewDecisionEntity,
    ]),
  ],
  controllers: [AuditAuditController],
  providers: [
    {
      provide: AuditAuditService,
      useClass: AuditAuditServiceImpl satisfies Type<AuditAuditService>,
    },
    CreateCommentUseCase,
    CreateEvidenceReferenceUseCase,
    CreateReviewDecisionUseCase,
    FindCommentsUseCase,
    FindEvidenceReferencesUseCase,
    FindReviewDecisionsUseCase,
    GetCommentByIdUseCase,
    GetEvidenceReferenceByIdUseCase,
    GetReviewDecisionByIdUseCase,
  ],
  exports: [AuditAuditService],
})
export class AuditAuditModule {}