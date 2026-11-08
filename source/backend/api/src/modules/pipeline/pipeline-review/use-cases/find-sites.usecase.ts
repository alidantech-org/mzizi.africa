import { reviewerDataSource, pageMeta, paging } from '#/database/reviewer-database';
import { Injectable, NotImplementedException } from '@nestjs/common';
import type { PageQueryDto } from '#/modules/pipeline/dto/page-query.dto';
import type { SiteListResponseDto } from '#/modules/pipeline/dto/site-list-response.dto';
import type { SiteSummaryDto } from '#/modules/pipeline/dto/site-summary.dto';
import type { ActorContextDto } from '#/modules/shared/dto/actor-context.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';

/**
 * List registered sites.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class FindSitesUseCase {

  async execute(input: PageQueryDto): Promise<SiteListResponseDto> {
    const db = await reviewerDataSource();
    const { page, limit, offset } = paging(input);
    const [{ total }] = await db.query(`SELECT count(*)::int AS total FROM website.sites`);
    const sites = await db.query(
      `SELECT s.id, s.name, s.status::text AS status, s.kind::text AS kind,
              (SELECT d.hostname FROM website.domains d WHERE d.site_id = s.id ORDER BY d.role, d.created_at LIMIT 1) AS "primaryDomain"
       FROM website.sites s ORDER BY s.name, s.id LIMIT ${limit} OFFSET ${offset}`,
    );
    return { sites, meta: pageMeta(page, limit, total) } as unknown as SiteListResponseDto;
  }
}