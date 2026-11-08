import { reviewerDataSource, pageMeta, paging } from '#/database/reviewer-database';
import { Injectable, NotImplementedException } from '@nestjs/common';
import type { PageQueryDto } from '#/modules/pipeline/dto/page-query.dto';
import type { RunListResponseDto } from '#/modules/pipeline/dto/run-list-response.dto';
import type { RunSummaryDto } from '#/modules/pipeline/dto/run-summary.dto';
import type { ActorContextDto } from '#/modules/shared/dto/actor-context.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';

/**
 * List staging runs.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class FindRunsUseCase {

  async execute(input: PageQueryDto): Promise<RunListResponseDto> {
    const db = await reviewerDataSource();
    const { page, limit, offset } = paging(input);
    const [{ total }] = await db.query(`SELECT count(*)::int AS total FROM staging.runs`);
    const runs = await db.query(
      `SELECT r.id, r.dataset, r.mapping_version AS "mappingVersion", r.status, r.created_at AS "createdAt",
              (SELECT count(*)::int FROM staging.candidates c WHERE c.run_id = r.id) AS candidates
       FROM staging.runs r ORDER BY r.created_at DESC, r.id LIMIT ${limit} OFFSET ${offset}`,
    );
    return { runs, meta: pageMeta(page, limit, total) } as unknown as RunListResponseDto;
  }
}