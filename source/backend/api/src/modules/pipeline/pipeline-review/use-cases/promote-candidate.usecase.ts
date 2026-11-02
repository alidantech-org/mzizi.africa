import { execFile } from 'node:child_process';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { requireActor } from '#/auth/actor-context';
import type { PromoteResponseDto } from '#/modules/pipeline/dto/promote-response.dto';

const run = promisify(execFile);

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
    const url = process.env.DATABASE_PROMOTE_URL;
    if (!url) throw new ServiceUnavailableException('promotion is not configured');
    const directory = process.env.ENGINE_DATABASE_DIR ?? join(process.cwd(), '..', 'engine', 'database');
    try {
      const { stdout } = await run('bun', ['src/cli.ts', 'promote-one', input.candidateId], { cwd: directory, env: { ...process.env, DATABASE_URL: url }, timeout: 120_000 });
      const result = JSON.parse(stdout.trim().split('\n').pop() ?? '{}') as { outcome: string; targetId?: string; reasons?: string[] };
      return { outcome: result.outcome, reason: result.reasons?.length ? result.reasons.join('; ') : null, recordId: result.targetId ?? null } as unknown as PromoteResponseDto;
    } catch {
      throw new ServiceUnavailableException('the database engine could not promote this candidate');
    }
  }
}
