import { reviewerDataSource, pageMeta, paging } from '#/database/reviewer-database';
import { Injectable, NotImplementedException } from '@nestjs/common';
import type { JobListResponseDto } from '#/modules/pipeline/dto/job-list-response.dto';
import type { JobSummaryDto } from '#/modules/pipeline/dto/job-summary.dto';
import type { PageQueryDto } from '#/modules/pipeline/dto/page-query.dto';
import type { ActorContextDto } from '#/modules/shared/dto/actor-context.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';

/**
 * List data engine jobs.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class FindJobsUseCase {

  async execute(input: PageQueryDto): Promise<JobListResponseDto> {
    const db = await reviewerDataSource();
    const { page, limit, offset } = paging(input);
    const [{ total }] = await db.query(`SELECT count(*)::int AS total FROM engine.jobs`);
    const jobs = await db.query(`SELECT id, kind, status, attempts, error, created_at AS "createdAt" FROM engine.jobs ORDER BY created_at DESC, id LIMIT ${limit} OFFSET ${offset}`);
    return { jobs, meta: pageMeta(page, limit, total) } as unknown as JobListResponseDto;
  }
}