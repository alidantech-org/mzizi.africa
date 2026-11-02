import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, DeepPartial } from 'typeorm';
import type { CreateReviewDecisionBodyDto } from '#/modules/audit/dto/create-review-decision-body.dto';
import type { ReviewDecisionPublicDto } from '#/modules/audit/dto/review-decision-public.dto';
import type { ReviewDecisionResponseDto } from '#/modules/audit/dto/review-decision-response.dto';
import type { ReviewDecisionDto } from '#/modules/audit/dto/review-decision.dto';
import type { ActorContextDto } from '#/modules/shared/dto/actor-context.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import { ReviewDecisionEntity } from '#/modules/audit/entities/review-decision.entity';

/**
 * Record a review decision about a record.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting create implementation from the contract (response read projection
 * of ReviewDecisionEntity); review it and add business rules here.
 */
@Injectable()
export class CreateReviewDecisionUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ReviewDecisionEntity);
  }

  /** System fields the contract leaves to the implementation: timestamps and the version. */
  private stamp(entity: ReviewDecisionEntity, created: boolean): void {
    const now = new Date();
    const target = entity as unknown as Record<string, unknown>;
    const has = (name: string) => this.repository.metadata.findColumnWithPropertyName(name) !== undefined;
    if (created && has("createdAt")) target.createdAt = now;
    if (has("updatedAt")) target.updatedAt = now;
    if (has("version")) target.version = created ? 1 : Number(target.version ?? 0) + 1;
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

  async execute(input: CreateReviewDecisionBodyDto): Promise<ReviewDecisionResponseDto> {
    const entity = this.repository.create(input as DeepPartial<ReviewDecisionEntity>);
    this.stamp(entity, true);
    const saved = await this.repository.save(entity);
    return {
      decision: this.toReadModel(saved),
    } as unknown as ReviewDecisionResponseDto;
  }
}