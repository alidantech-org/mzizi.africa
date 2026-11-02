import { reviewerDataSource, pageMeta, paging } from '#/database/reviewer-database';
import { Injectable, NotImplementedException } from '@nestjs/common';
import type { DossierListResponseDto } from '#/modules/pipeline/dto/dossier-list-response.dto';
import type { DossierSummaryDto } from '#/modules/pipeline/dto/dossier-summary.dto';
import type { PageQueryDto } from '#/modules/pipeline/dto/page-query.dto';
import type { ActorContextDto } from '#/modules/shared/dto/actor-context.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';

/**
 * List jurisdiction legal dossiers.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class FindDossiersUseCase {

  async execute(input: PageQueryDto): Promise<DossierListResponseDto> {
    const db = await reviewerDataSource();
    const { page, limit, offset } = paging(input);
    const [{ total }] = await db.query(`SELECT count(*)::int AS total FROM website.dossiers`);
    const dossiers = await db.query(
      `SELECT d.id, d.jurisdiction_id AS "jurisdictionId", j.name AS "jurisdictionName", d.launch_stage::text AS "launchStage", d.is_current AS "isCurrent", d.reviewed_at AS "reviewedAt", d.open_questions AS "openQuestions"
       FROM website.dossiers d JOIN reference.jurisdictions j ON j.id = d.jurisdiction_id ORDER BY d.is_current DESC, j.name, d.created_at DESC LIMIT ${limit} OFFSET ${offset}`,
    );
    return { dossiers, meta: pageMeta(page, limit, total) } as unknown as DossierListResponseDto;
  }
}