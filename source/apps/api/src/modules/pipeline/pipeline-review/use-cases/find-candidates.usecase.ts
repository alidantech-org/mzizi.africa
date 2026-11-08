import { reviewerDataSource, pageMeta, paging } from '#/database/reviewer-database';
import { Injectable, NotImplementedException } from '@nestjs/common';
import type { CandidateListQueryDto } from '#/modules/pipeline/dto/candidate-list-query.dto';
import type { CandidateListResponseDto } from '#/modules/pipeline/dto/candidate-list-response.dto';
import type { CandidateSummaryDto } from '#/modules/pipeline/dto/candidate-summary.dto';
import type { ActorContextDto } from '#/modules/shared/dto/actor-context.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';

/**
 * List staged candidates.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class FindCandidatesUseCase {

  async execute(input: CandidateListQueryDto): Promise<CandidateListResponseDto> {
    const db = await reviewerDataSource();
    const { page, limit, offset } = paging(input);
    const where: string[] = [];
    const values: unknown[] = [];
    for (const [column, value] of [["c.status", input.status], ["c.target_kind", input.targetKind], ["c.run_id", input.runId]] as const) {
      if (value) {
        values.push(value);
        where.push(`${column} = $${values.length}`);
      }
    }
    const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const [{ total }] = await db.query(`SELECT count(*)::int AS total FROM staging.candidates c ${clause}`, values);
    const rows = await db.query(
      `SELECT c.id, c.run_id AS "runId", c.target_kind AS "targetKind", c.status, c.method, c.confidence::float AS confidence, c.created_at AS "createdAt",
              (SELECT count(*)::int FROM staging.issues i WHERE i.candidate_id = c.id) AS "issueCount"
       FROM staging.candidates c ${clause} ORDER BY c.created_at DESC, c.id LIMIT ${limit} OFFSET ${offset}`,
      values,
    );
    return { candidates: rows, meta: pageMeta(page, limit, total) } as unknown as CandidateListResponseDto;
  }
}