import { reviewerDataSource, pageMeta, paging } from '#/database/reviewer-database';
import { Injectable, NotImplementedException } from '@nestjs/common';
import type { AssessmentListResponseDto } from '#/modules/pipeline/dto/assessment-list-response.dto';
import type { AssessmentSummaryDto } from '#/modules/pipeline/dto/assessment-summary.dto';
import type { PageQueryDto } from '#/modules/pipeline/dto/page-query.dto';
import type { ActorContextDto } from '#/modules/shared/dto/actor-context.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';

/**
 * List site legal and source assessments.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class FindAssessmentsUseCase {

  async execute(input: PageQueryDto): Promise<AssessmentListResponseDto> {
    const db = await reviewerDataSource();
    const { page, limit, offset } = paging(input);
    const [{ total }] = await db.query(`SELECT count(*)::int AS total FROM website.assessments`);
    const assessments = await db.query(
      `SELECT a.id, a.site_id AS "siteId", s.name AS "siteName", a.status::text AS status, a.is_current AS "isCurrent", a.source_type::text AS "sourceType",
              a.rights_holder AS "rightsHolder", a.approved_scope AS "approvedScope", a.rationale, a.reviewed_by AS "reviewedBy", a.reviewed_at AS "reviewedAt"
       FROM website.assessments a JOIN website.sites s ON s.id = a.site_id ORDER BY a.is_current DESC, a.created_at DESC, a.id LIMIT ${limit} OFFSET ${offset}`,
    );
    return { assessments, meta: pageMeta(page, limit, total) } as unknown as AssessmentListResponseDto;
  }
}