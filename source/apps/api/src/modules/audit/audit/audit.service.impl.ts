import { Injectable } from '@nestjs/common';
import type { CommentListQueryDto } from '#/modules/audit/dto/comment-list-query.dto';
import type { CommentResponseDto } from '#/modules/audit/dto/comment-response.dto';
import type { CommentsListResponseDto } from '#/modules/audit/dto/comments-list-response.dto';
import type { CreateCommentBodyDto } from '#/modules/audit/dto/create-comment-body.dto';
import type { CreateEvidenceReferenceBodyDto } from '#/modules/audit/dto/create-evidence-reference-body.dto';
import type { CreateReviewDecisionBodyDto } from '#/modules/audit/dto/create-review-decision-body.dto';
import type { EvidenceReferenceListQueryDto } from '#/modules/audit/dto/evidence-reference-list-query.dto';
import type { EvidenceReferenceResponseDto } from '#/modules/audit/dto/evidence-reference-response.dto';
import type { EvidenceReferencesListResponseDto } from '#/modules/audit/dto/evidence-references-list-response.dto';
import type { ReviewDecisionListQueryDto } from '#/modules/audit/dto/review-decision-list-query.dto';
import type { ReviewDecisionResponseDto } from '#/modules/audit/dto/review-decision-response.dto';
import type { ReviewDecisionsListResponseDto } from '#/modules/audit/dto/review-decisions-list-response.dto';
import { CreateCommentUseCase } from '#/modules/audit/audit/use-cases/create-comment.usecase';
import { CreateEvidenceReferenceUseCase } from '#/modules/audit/audit/use-cases/create-evidence-reference.usecase';
import { CreateReviewDecisionUseCase } from '#/modules/audit/audit/use-cases/create-review-decision.usecase';
import { FindCommentsUseCase } from '#/modules/audit/audit/use-cases/find-comments.usecase';
import { FindEvidenceReferencesUseCase } from '#/modules/audit/audit/use-cases/find-evidence-references.usecase';
import { FindReviewDecisionsUseCase } from '#/modules/audit/audit/use-cases/find-review-decisions.usecase';
import { GetCommentByIdUseCase } from '#/modules/audit/audit/use-cases/get-comment-by-id.usecase';
import { GetEvidenceReferenceByIdUseCase } from '#/modules/audit/audit/use-cases/get-evidence-reference-by-id.usecase';
import { GetReviewDecisionByIdUseCase } from '#/modules/audit/audit/use-cases/get-review-decision-by-id.usecase';

/**
 * Audit: implements the generated AuditAuditService contract by
 * delegating to one use case per operation. The feature module binds it to that contract.
 *
 * Scaffolded by Dryv once; this file belongs to the project. New operations need a method here.
 */
@Injectable()
export class AuditAuditServiceImpl {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly createEvidenceReferenceUseCase: CreateEvidenceReferenceUseCase,
    private readonly createReviewDecisionUseCase: CreateReviewDecisionUseCase,
    private readonly findCommentsUseCase: FindCommentsUseCase,
    private readonly findEvidenceReferencesUseCase: FindEvidenceReferencesUseCase,
    private readonly findReviewDecisionsUseCase: FindReviewDecisionsUseCase,
    private readonly getCommentByIdUseCase: GetCommentByIdUseCase,
    private readonly getEvidenceReferenceByIdUseCase: GetEvidenceReferenceByIdUseCase,
    private readonly getReviewDecisionByIdUseCase: GetReviewDecisionByIdUseCase,
  ) {}

  /** Add a comment to a record. */
  createComment(input: CreateCommentBodyDto) {
    return this.createCommentUseCase.execute(input);
  }

  /** Attach an evidence reference (a file artifact held by the files service) to a record. */
  createEvidenceReference(input: CreateEvidenceReferenceBodyDto) {
    return this.createEvidenceReferenceUseCase.execute(input);
  }

  /** Record a review decision about a record. */
  createReviewDecision(input: CreateReviewDecisionBodyDto) {
    return this.createReviewDecisionUseCase.execute(input);
  }

  /** List comments. */
  findComments(input: CommentListQueryDto) {
    return this.findCommentsUseCase.execute(input);
  }

  /** List evidence references. */
  findEvidenceReferences(input: EvidenceReferenceListQueryDto) {
    return this.findEvidenceReferencesUseCase.execute(input);
  }

  /** List review decisions. */
  findReviewDecisions(input: ReviewDecisionListQueryDto) {
    return this.findReviewDecisionsUseCase.execute(input);
  }

  /** Get comments by id. */
  getCommentById(input: { commentId: string }) {
    return this.getCommentByIdUseCase.execute(input);
  }

  /** Get evidence references by id. */
  getEvidenceReferenceById(input: { evidenceId: string }) {
    return this.getEvidenceReferenceByIdUseCase.execute(input);
  }

  /** Get review decisions by id. */
  getReviewDecisionById(input: { decisionId: string }) {
    return this.getReviewDecisionByIdUseCase.execute(input);
  }
}