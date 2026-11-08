import { reviewerDataSource, pageMeta, paging } from '#/database/reviewer-database';
import { Injectable, NotImplementedException } from '@nestjs/common';
import type { CaptureListResponseDto } from '#/modules/pipeline/dto/capture-list-response.dto';
import type { CaptureSummaryDto } from '#/modules/pipeline/dto/capture-summary.dto';
import type { PageQueryDto } from '#/modules/pipeline/dto/page-query.dto';
import type { ActorContextDto } from '#/modules/shared/dto/actor-context.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';

/**
 * List captures (retrievals of a document), newest first.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class FindCapturesUseCase {

  async execute(input: PageQueryDto): Promise<CaptureListResponseDto> {
    const db = await reviewerDataSource();
    const { page, limit, offset } = paging(input);
    const [{ total }] = await db.query(`SELECT count(*)::int AS total FROM source.captures`);
    const rows = await db.query(
      `SELECT c.id, c.document_id AS "documentId", d.title AS "documentTitle", c.site_id AS "siteId", c.retrieved_url AS "retrievedUrl", c.http_status AS "httpStatus", c.content_hash AS "contentHash", c.tool, c.retrieved_at AS "retrievedAt"
       FROM source.captures c JOIN source.documents d ON d.id = c.document_id ORDER BY c.retrieved_at DESC, c.id LIMIT ${limit} OFFSET ${offset}`,
    );
    return { captures: rows, meta: pageMeta(page, limit, total) } as unknown as CaptureListResponseDto;
  }
}