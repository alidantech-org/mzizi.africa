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
import { CommentListQueryDto } from "#/modules/audit/dto/comment-list-query.dto.ts";
import { CommentResponseDto } from "#/modules/audit/dto/comment-response.dto.ts";
import { CommentsListResponseDto } from "#/modules/audit/dto/comments-list-response.dto.ts";
import { CreateCommentBodyDto } from "#/modules/audit/dto/create-comment-body.dto.ts";
import { CreateEvidenceReferenceBodyDto } from "#/modules/audit/dto/create-evidence-reference-body.dto.ts";
import { CreateReviewDecisionBodyDto } from "#/modules/audit/dto/create-review-decision-body.dto.ts";
import { EvidenceReferenceListQueryDto } from "#/modules/audit/dto/evidence-reference-list-query.dto.ts";
import { EvidenceReferenceResponseDto } from "#/modules/audit/dto/evidence-reference-response.dto.ts";
import { EvidenceReferencesListResponseDto } from "#/modules/audit/dto/evidence-references-list-response.dto.ts";
import { ReviewDecisionListQueryDto } from "#/modules/audit/dto/review-decision-list-query.dto.ts";
import { ReviewDecisionResponseDto } from "#/modules/audit/dto/review-decision-response.dto.ts";
import { ReviewDecisionsListResponseDto } from "#/modules/audit/dto/review-decisions-list-response.dto.ts";
import { AuditAuditService } from "./audit.service.ts";

@Controller()
export class AuditAuditController {
  constructor(private readonly service: AuditAuditService) {}


  @Post("/v1/audit/comments")
  @HttpCode(201)
  createComment(
    @Body() input: CreateCommentBodyDto,
  ): Promise<CommentResponseDto> {
    return this.service.createComment(input);
  }


  @Post("/v1/audit/evidence")
  @HttpCode(201)
  createEvidenceReference(
    @Body() input: CreateEvidenceReferenceBodyDto,
  ): Promise<EvidenceReferenceResponseDto> {
    return this.service.createEvidenceReference(input);
  }


  @Post("/v1/audit/decisions")
  @HttpCode(201)
  createReviewDecision(
    @Body() input: CreateReviewDecisionBodyDto,
  ): Promise<ReviewDecisionResponseDto> {
    return this.service.createReviewDecision(input);
  }


  @Get("/v1/audit/comments")
  @HttpCode(200)
  findComments(
    @Query() input: CommentListQueryDto,
  ): Promise<CommentsListResponseDto> {
    return this.service.findComments(input);
  }


  @Get("/v1/audit/evidence")
  @HttpCode(200)
  findEvidenceReferences(
    @Query() input: EvidenceReferenceListQueryDto,
  ): Promise<EvidenceReferencesListResponseDto> {
    return this.service.findEvidenceReferences(input);
  }


  @Get("/v1/audit/decisions")
  @HttpCode(200)
  findReviewDecisions(
    @Query() input: ReviewDecisionListQueryDto,
  ): Promise<ReviewDecisionsListResponseDto> {
    return this.service.findReviewDecisions(input);
  }


  @Get("/v1/audit/comments/:commentId")
  @HttpCode(200)
  getCommentById(
    @Param("commentId") commentId: string,
  ): Promise<CommentResponseDto> {
    return this.service.getCommentById({ commentId });
  }


  @Get("/v1/audit/evidence/:evidenceId")
  @HttpCode(200)
  getEvidenceReferenceById(
    @Param("evidenceId") evidenceId: string,
  ): Promise<EvidenceReferenceResponseDto> {
    return this.service.getEvidenceReferenceById({ evidenceId });
  }


  @Get("/v1/audit/decisions/:decisionId")
  @HttpCode(200)
  getReviewDecisionById(
    @Param("decisionId") decisionId: string,
  ): Promise<ReviewDecisionResponseDto> {
    return this.service.getReviewDecisionById({ decisionId });
  }
}