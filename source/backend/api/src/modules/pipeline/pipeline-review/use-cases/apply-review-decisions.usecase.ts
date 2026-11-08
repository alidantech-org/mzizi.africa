import { requireActor } from '#/auth/actor-context';
import { engineCommand } from '#/database/engine-command';
import { Injectable, NotImplementedException } from '@nestjs/common';
import type { ApplyReviewsQueryDto } from '#/modules/pipeline/dto/apply-reviews-query.dto';
import type { ApplyReviewsResponseDto } from '#/modules/pipeline/dto/apply-reviews-response.dto';
import type { ActorContextDto } from '#/modules/shared/dto/actor-context.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';

/**
 * Apply recorded review decisions to their candidates (approved, rejected, held) through the database engine.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class ApplyReviewDecisionsUseCase {

  async execute(input: ApplyReviewsQueryDto): Promise<ApplyReviewsResponseDto> {
    requireActor();
    const result = await engineCommand(['apply-review']);
    return { applied: Number((result as { applied?: number }).applied ?? 0), detail: JSON.stringify(result) } as unknown as ApplyReviewsResponseDto;
  }
}