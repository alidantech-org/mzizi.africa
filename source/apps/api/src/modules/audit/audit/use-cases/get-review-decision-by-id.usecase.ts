import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ReviewDecisionPublicDto } from '#/modules/audit/dto/review-decision-public.dto';
import type { ReviewDecisionResponseDto } from '#/modules/audit/dto/review-decision-response.dto';
import type { ReviewDecisionDto } from '#/modules/audit/dto/review-decision.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import { ReviewDecisionEntity } from '#/modules/audit/entities/review-decision.entity';

/**
 * Get review decisions by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of ReviewDecisionEntity); review it and add business rules here.
 */
@Injectable()
export class GetReviewDecisionByIdUseCase {
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

  async execute(input: { decisionId: string }): Promise<ReviewDecisionResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.decisionId } as never);
    if (!entity) throw new NotFoundException('ReviewDecision not found');
    return {
      decision: this.toReadModel(entity),
    } as unknown as ReviewDecisionResponseDto;
  }
}