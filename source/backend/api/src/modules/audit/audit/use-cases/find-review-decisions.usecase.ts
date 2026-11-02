import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ReviewDecisionListQueryDto } from '#/modules/audit/dto/review-decision-list-query.dto';
import type { ReviewDecisionPublicDto } from '#/modules/audit/dto/review-decision-public.dto';
import type { ReviewDecisionDto } from '#/modules/audit/dto/review-decision.dto';
import type { ReviewDecisionsListResponseDto } from '#/modules/audit/dto/review-decisions-list-response.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { ReviewDecisionEntity } from '#/modules/audit/entities/review-decision.entity';

/**
 * List review decisions.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of ReviewDecisionEntity); review it and add business rules here.
 */
@Injectable()
export class FindReviewDecisionsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ReviewDecisionEntity);
  }

  private toReadModel(entity: ReviewDecisionEntity): ReviewDecisionPublicDto {
    return {
    createdAt: entity.createdAt,
    decision: entity.decision,
    id: entity.id,
    proposedState: entity.proposedState,
    rationale: entity.rationale,
    reviewerId: entity.reviewerId,
    targetId: entity.targetId,
    targetKind: entity.targetKind,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as ReviewDecisionPublicDto;
  }

  async execute(input: ReviewDecisionListQueryDto): Promise<ReviewDecisionsListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.targetId !== undefined) where.targetId = input.targetId;
    if (input.targetKind !== undefined) where.targetKind = input.targetKind;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<ReviewDecisionEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      decisions: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as ReviewDecisionsListResponseDto;
  }
}