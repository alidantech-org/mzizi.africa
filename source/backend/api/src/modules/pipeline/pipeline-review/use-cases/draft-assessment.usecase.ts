import { requireActor } from '#/auth/actor-context';
import { engineCommand } from '#/database/engine-command';
import { Injectable, NotImplementedException } from '@nestjs/common';
import type { DraftAssessmentRequestDto } from '#/modules/pipeline/dto/draft-assessment-request.dto';
import type { DraftAssessmentResponseDto } from '#/modules/pipeline/dto/draft-assessment-response.dto';
import type { ActorContextDto } from '#/modules/shared/dto/actor-context.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';

/**
 * Draft a site assessment as in_review; a draft never authorises collection.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class DraftAssessmentUseCase {

  async execute(input: DraftAssessmentRequestDto): Promise<DraftAssessmentResponseDto> {
    const actor = requireActor();
    // The drafter is the verified token's subject; the engine re-checks assessment.draft and records the row as in_review.
    const draft = { siteId: input.siteId, accessBasis: input.accessBasis, sourceType: input.sourceType, rightsHolder: input.rightsHolder, approvedScope: input.approvedScope, rationale: input.rationale, evidence: input.evidence };
    return (await engineCommand(['draft-assessment', actor.actorId, JSON.stringify(draft)])) as unknown as DraftAssessmentResponseDto;
  }
}