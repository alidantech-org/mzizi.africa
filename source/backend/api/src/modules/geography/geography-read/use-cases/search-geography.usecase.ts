import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ENTITY_SQL, CURRENT_VERIFIED_BOUNDARY_SQL, toEntity, toFeature, type Row } from '#/modules/geography/geography-read/geography-read.queries';
import type { GeographySearchQueryDto } from '#/modules/geography/dto/geography-search-query.dto';
import type { GeographySearchResponseDto } from '#/modules/geography/dto/geography-search-response.dto';

/**
 * Scaffolded by Dryv once; this file belongs to the project.
 */
@Injectable()
export class SearchGeographyUseCase {
  constructor(@InjectDataSource() private readonly db: DataSource) {}

  async execute(input: GeographySearchQueryDto): Promise<GeographySearchResponseDto> {
    const limit = Math.min(Math.max(Number(input.limit) || 12, 1), 50);
    const rows: Row[] = await this.db.query(
      `${ENTITY_SQL}
        WHERE u.is_current = true AND (u.name ILIKE $1 OR u.code ILIKE $1)
          AND ($2::text IS NULL OR lower(j.code) = lower($2))
        ORDER BY u.name LIMIT $3`,
      [`%${input.q}%`, input.country ?? null, limit],
    );
    return { results: rows.map(toEntity) } as GeographySearchResponseDto;
  }
}
