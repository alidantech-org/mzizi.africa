import { reviewerDataSource, pageMeta, paging } from '#/database/reviewer-database';
import { Injectable, NotImplementedException } from '@nestjs/common';
import type { CheckListResponseDto } from '#/modules/pipeline/dto/check-list-response.dto';
import type { CheckSummaryDto } from '#/modules/pipeline/dto/check-summary.dto';
import type { PageQueryDto } from '#/modules/pipeline/dto/page-query.dto';
import type { ActorContextDto } from '#/modules/shared/dto/actor-context.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';

/**
 * List site checks, newest first.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class FindChecksUseCase {

  async execute(input: PageQueryDto): Promise<CheckListResponseDto> {
    const db = await reviewerDataSource();
    const { page, limit, offset } = paging(input);
    const [{ total }] = await db.query(`SELECT count(*)::int AS total FROM website.checks`);
    const rows = await db.query(
      `SELECT c.id, c.site_id AS "siteId", s.name AS "siteName", c.kind::text AS kind, c.outcome::text AS outcome, c.detail, c.checked_at AS "checkedAt"
       FROM website.checks c JOIN website.sites s ON s.id = c.site_id ORDER BY c.checked_at DESC, c.id LIMIT ${limit} OFFSET ${offset}`,
    );
    return { checks: rows, meta: pageMeta(page, limit, total) } as unknown as CheckListResponseDto;
  }
}