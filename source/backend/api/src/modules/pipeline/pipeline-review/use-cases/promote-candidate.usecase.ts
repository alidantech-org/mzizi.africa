import { engineCommand } from '#/database/engine-command';
import { Injectable } from '@nestjs/common';
import { requireActor } from '#/auth/actor-context';
import type { PromoteResponseDto } from '#/modules/pipeline/dto/promote-response.dto';

/**
 * Promote an approved candidate to a canonical record through the database engine.
 *
 * Promotion is owned by the database engine, so this asks it rather than reimplementing it: it runs the
 * engine's `promote-one` command with the promotion role's connection (DATABASE_PROMOTE_URL), never the
 * read-only or reviewer roles. The engine decides (approved decision, licence, capture, legal status) and
 * returns either the new record or the reasons it deferred. The acting admin is checked by the guard.
 */
@Injectable()
export class PromoteCandidateUseCase {
  async execute(input: { candidateId: string }): Promise<PromoteResponseDto> {
    requireActor();
    const result = (await engineCommand(['promote-one', input.candidateId])) as { outcome: string; targetId?: string; reasons?: string[] };
    return { outcome: result.outcome, reason: result.reasons?.length ? result.reasons.join('; ') : null, recordId: result.targetId ?? null } as unknown as PromoteResponseDto;
  }
}
