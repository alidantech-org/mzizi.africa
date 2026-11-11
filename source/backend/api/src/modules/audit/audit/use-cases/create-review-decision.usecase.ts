import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { requireActor } from '#/auth/actor-context';
import { writeDatabase } from '#/database/write-database';
import { assertTarget } from '#/modules/audit/audit/target';
import type { ReviewDecisionResponseDto } from '#/modules/audit/dto/review-decision-response.dto';
import type { CreateReviewDecisionBodyDto } from '#/modules/audit/dto/create-review-decision-body.dto';

/**
 * Project-owned. Writes with the restricted-writer connection; the actor comes from the verified
 * token, never the body. Records are append-only: corrections are new records.
 */
@Injectable()
export class CreateReviewDecisionUseCase {
  constructor(@InjectDataSource() private readonly readDb: DataSource) {}

  async execute(input: CreateReviewDecisionBodyDto): Promise<ReviewDecisionResponseDto> {
    const actor = requireActor();
    await assertTarget(this.readDb, input.targetKind, input.targetId);
    return writeDatabase<ReviewDecisionResponseDto>('decisions', { ...input, actorId: actor.actorId });
  }
}
