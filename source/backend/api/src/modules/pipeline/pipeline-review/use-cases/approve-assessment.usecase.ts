import { requireActor } from '#/auth/actor-context';
import { engineCommand } from '#/database/engine-command';
import { Injectable, NotImplementedException } from '@nestjs/common';
import type { AssessmentDecisionResponseDto } from '#/modules/pipeline/dto/assessment-decision-response.dto';
import type { ActorContextDto } from '#/modules/shared/dto/actor-context.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';

/**
 * Approve a site assessment; only a named human account holding assessment.approve.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class ApproveAssessmentUseCase {

  async execute(input: { assessmentId: string }): Promise<AssessmentDecisionResponseDto> {
    const actor = requireActor();
    // The acting account is the verified token's subject, never a request field; the engine re-checks it is a human holding assessment.approve.
    const result = await engineCommand(['decide-assessment', input.assessmentId, actor.actorId, 'approved']);
    return result as unknown as AssessmentDecisionResponseDto;
  }
}