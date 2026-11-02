import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ENTITY_SQL, CURRENT_VERIFIED_BOUNDARY_SQL, toEntity, toFeature, type Row } from '#/modules/geography/geography-read/geography-read.queries';
import type { GeographyFeatureResponseDto } from '#/modules/geography/dto/geography-feature-response.dto';

/**
 * Scaffolded by Dryv once; this file belongs to the project.
 */
@Injectable()
export class GetChildBoundariesUseCase {
  constructor(@InjectDataSource() private readonly db: DataSource) {}

  async execute(input: { entityId: string }): Promise<GeographyFeatureResponseDto> {
    const rows: Row[] = await this.db.query(
      `SELECT u.id, u.code, u.name, v.geometry, v.label_point
         FROM geo.units u
         JOIN LATERAL (${CURRENT_VERIFIED_BOUNDARY_SQL}) v ON true
        WHERE u.parent_id = $1 AND u.is_current = true ORDER BY u.name`,
      [input.entityId],
    );
    const collection = { type: 'FeatureCollection', features: rows.map(toFeature) };
    return { geojson: JSON.stringify(collection), boundaryVerified: true } as GeographyFeatureResponseDto;
  }
}
