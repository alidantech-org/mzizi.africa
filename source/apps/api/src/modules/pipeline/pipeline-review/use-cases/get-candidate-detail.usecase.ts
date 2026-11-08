import { reviewerDataSource, pageMeta, paging } from '#/database/reviewer-database';
import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import type { CandidateDetailResponseDto } from '#/modules/pipeline/dto/candidate-detail-response.dto';
import type { CandidateIssueDto } from '#/modules/pipeline/dto/candidate-issue.dto';
import type { CandidateSummaryDto } from '#/modules/pipeline/dto/candidate-summary.dto';
import type { ActorContextDto } from '#/modules/shared/dto/actor-context.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';

/**
 * Get a staged candidate with payload, issues, lineage and the current canonical record.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class GetCandidateDetailUseCase {

  async execute(input: { candidateId: string }): Promise<CandidateDetailResponseDto> {
    const db = await reviewerDataSource();
    const [row] = await db.query(
      `SELECT c.id, c.run_id AS "runId", c.target_kind AS "targetKind", c.status, c.method, c.confidence::float AS confidence, c.created_at AS "createdAt",
              (SELECT count(*)::int FROM staging.issues i WHERE i.candidate_id = c.id) AS "issueCount",
              c.payload::text AS payload, c.locator::text AS locator, c.segment_key AS "segmentKey",
              c.extraction_result_id AS "extractionResultId", c.resolved_target_id AS "resolvedTargetId", r.capture_id AS "captureId"
       FROM staging.candidates c JOIN staging.runs r ON r.id = c.run_id WHERE c.id = $1`,
      [input.candidateId],
    );
    if (!row) throw new NotFoundException("candidate not found");
    const issues = await db.query(`SELECT rule, severity, message FROM staging.issues WHERE candidate_id = $1 ORDER BY created_at, id`, [input.candidateId]);
    let current: string | null = null;
    // The target kind is a schema-qualified table name; only a name that exists is ever interpolated.
    if (row.resolvedTargetId && /^[a-z_]+\.[a-z_]+$/.test(row.targetKind)) {
      const [schema, table] = row.targetKind.split(".");
      const [known] = await db.query(`SELECT 1 AS ok FROM information_schema.tables WHERE table_schema = $1 AND table_name = $2`, [schema, table]);
      if (known) {
        const [record] = await db.query(`SELECT to_jsonb(t)::text AS doc FROM "${schema}"."${table}" t WHERE id = $1`, [row.resolvedTargetId]);
        current = record?.doc ?? null;
      }
    }
    const { payload, locator, segmentKey, extractionResultId, resolvedTargetId: _resolved, captureId, ...summary } = row;
    return { candidate: summary, payload, locator, segmentKey, extractionResultId, captureId, documentId: null, siteId: null, issues, current } as unknown as CandidateDetailResponseDto;
  }
}