import { reviewerDataSource, pageMeta, paging } from '#/database/reviewer-database';
import { Injectable, NotImplementedException } from '@nestjs/common';
import type { PageQueryDto } from '#/modules/pipeline/dto/page-query.dto';
import type { StructureVersionListResponseDto } from '#/modules/pipeline/dto/structure-version-list-response.dto';
import type { StructureVersionSummaryDto } from '#/modules/pipeline/dto/structure-version-summary.dto';
import type { ActorContextDto } from '#/modules/shared/dto/actor-context.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';

/**
 * List site structure versions.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class FindStructureVersionsUseCase {

  async execute(input: PageQueryDto): Promise<StructureVersionListResponseDto> {
    const db = await reviewerDataSource();
    const { page, limit, offset } = paging(input);
    const [{ total }] = await db.query(`SELECT count(*)::int AS total FROM website.structure_versions`);
    const rows = await db.query(
      `SELECT v.id, v.structure_id AS "structureId", s.purpose, v.number, v.status::text AS status, (s.current_version_id = v.id) AS "isCurrent", v.schema_version AS "schemaVersion", v.notes_summary AS notes, v.created_at AS "createdAt"
       FROM website.structure_versions v JOIN website.structures s ON s.id = v.structure_id ORDER BY v.created_at DESC, v.id LIMIT ${limit} OFFSET ${offset}`,
    );
    return { structureVersions: rows, meta: pageMeta(page, limit, total) } as unknown as StructureVersionListResponseDto;
  }
}