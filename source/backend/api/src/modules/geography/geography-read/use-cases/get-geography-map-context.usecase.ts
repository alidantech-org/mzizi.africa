import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ENTITY_SQL, CURRENT_VERIFIED_BOUNDARY_SQL, toEntity, toFeature, type Row } from '#/modules/geography/geography-read/geography-read.queries';
import type { GeographyMapContextResponseDto } from '#/modules/geography/dto/geography-map-context-response.dto';

/**
 * Scaffolded by Dryv once; this file belongs to the project.
 */
@Injectable()
export class GetGeographyMapContextUseCase {
  constructor(@InjectDataSource() private readonly db: DataSource) {}

  async execute(input: { entityId: string }): Promise<GeographyMapContextResponseDto> {
    const [self]: Row[] = await this.db.query(`SELECT id, parent_id FROM geo.units WHERE id = $1`, [input.entityId]);
    if (!self) throw new NotFoundException('geography entity not found');
    const parentId = self.parent_id as string | null;
    let parentGeojson: string | null = null;
    let siblings: Row[] = [];
    if (parentId) {
      const [parent]: Row[] = await this.db.query(
        `SELECT u.id, u.code, u.name, v.geometry, v.label_point FROM geo.units u
           JOIN LATERAL (${CURRENT_VERIFIED_BOUNDARY_SQL}) v ON true WHERE u.id = $1`,
        [parentId],
      );
      parentGeojson = parent ? JSON.stringify(toFeature(parent)) : null;
      siblings = await this.db.query(
        `SELECT u.id, u.code, u.name, v.geometry, v.label_point FROM geo.units u
           JOIN LATERAL (${CURRENT_VERIFIED_BOUNDARY_SQL}) v ON true
          WHERE u.parent_id = $1 AND u.id <> $2 AND u.is_current = true ORDER BY u.name`,
        [parentId, input.entityId],
      );
    }
    return {
      parentGeojson,
      siblingsGeojson: JSON.stringify({ type: 'FeatureCollection', features: siblings.map(toFeature) }),
    } as unknown as GeographyMapContextResponseDto;
  }
}
