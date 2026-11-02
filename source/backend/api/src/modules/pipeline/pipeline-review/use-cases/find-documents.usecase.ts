import { reviewerDataSource, pageMeta, paging } from '#/database/reviewer-database';
import { Injectable, NotImplementedException } from '@nestjs/common';
import type { DocumentListResponseDto } from '#/modules/pipeline/dto/document-list-response.dto';
import type { DocumentSummaryDto } from '#/modules/pipeline/dto/document-summary.dto';
import type { PageQueryDto } from '#/modules/pipeline/dto/page-query.dto';
import type { ActorContextDto } from '#/modules/shared/dto/actor-context.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';

/**
 * List source documents with their capture counts.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class FindDocumentsUseCase {

  async execute(input: PageQueryDto): Promise<DocumentListResponseDto> {
    const db = await reviewerDataSource();
    const { page, limit, offset } = paging(input);
    const [{ total }] = await db.query(`SELECT count(*)::int AS total FROM source.documents`);
    const rows = await db.query(
      `SELECT d.id, d.title, COALESCE(k.label, d.kind_id::text) AS kind, p.name AS publisher, d.url, d.language, d.published_on::text AS "publishedOn",
              (SELECT count(*)::int FROM source.captures c WHERE c.document_id = d.id) AS captures
       FROM source.documents d JOIN source.publishers p ON p.id = d.publisher_id LEFT JOIN reference.classifications k ON k.id = d.kind_id
       ORDER BY d.created_at DESC, d.id LIMIT ${limit} OFFSET ${offset}`,
    );
    return { documents: rows, meta: pageMeta(page, limit, total) } as unknown as DocumentListResponseDto;
  }
}