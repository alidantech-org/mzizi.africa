import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ENTITY_SQL, CURRENT_VERIFIED_BOUNDARY_SQL, toEntity, toFeature, type Row } from '#/modules/geography/geography-read/geography-read.queries';
import type { GeographyBoundariesQueryDto } from '#/modules/geography/dto/geography-boundaries-query.dto';
import type { GeographyFeatureResponseDto } from '#/modules/geography/dto/geography-feature-response.dto';

/**
 * Scaffolded by Dryv once; this file belongs to the project.
 */
@Injectable()
export class ListBoundariesByLevelUseCase {
  constructor(@InjectDataSource() private readonly db: DataSource) {}

  async execute(input: GeographyBoundariesQueryDto): Promise<GeographyFeatureResponseDto> {
    const rows: Row[] = await this.db.query(
      `SELECT u.id, u.code, u.name, v.geometry, v.label_point
         FROM geography.units u
         JOIN reference.classifications c ON c.id = u.level_id
         JOIN reference.jurisdictions j ON j.id = u.jurisdiction_id
         JOIN LATERAL (${CURRENT_VERIFIED_BOUNDARY_SQL}) v ON true
        WHERE lower(j.code) = lower($1) AND lower(c.label) = lower($2) AND u.is_current = true
        ORDER BY u.name`,
      [input.country, input.level],
    );
    return {
      geojson: JSON.stringify({ type: 'FeatureCollection', features: rows.map(toFeature) }),
      boundaryVerified: true,
    } as unknown as GeographyFeatureResponseDto;
  }
}
