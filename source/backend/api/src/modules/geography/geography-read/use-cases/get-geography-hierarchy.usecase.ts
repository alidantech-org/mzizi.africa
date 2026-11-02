import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ENTITY_SQL, CURRENT_VERIFIED_BOUNDARY_SQL, toEntity, toFeature, type Row } from '#/modules/geography/geography-read/geography-read.queries';
import type { GeographyHierarchyResponseDto } from '#/modules/geography/dto/geography-hierarchy-response.dto';

/**
 * Scaffolded by Dryv once; this file belongs to the project.
 */
@Injectable()
export class GetGeographyHierarchyUseCase {
  constructor(@InjectDataSource() private readonly db: DataSource) {}

  async execute(input: { entityId: string }): Promise<GeographyHierarchyResponseDto> {
    const [self]: Row[] = await this.db.query(`${ENTITY_SQL} WHERE u.id = $1`, [input.entityId]);
    if (!self) throw new NotFoundException('geography entity not found');
    const chain: Array<{ id: string }> = await this.db.query(
      `WITH RECURSIVE a AS (
         SELECT p.id, p.parent_id, 1 AS depth FROM geo.units p WHERE p.id = (SELECT parent_id FROM geo.units WHERE id = $1)
         UNION ALL
         SELECT u.id, u.parent_id, a.depth + 1 FROM geo.units u JOIN a ON u.id = a.parent_id
       ) SELECT id FROM a ORDER BY depth DESC`,
      [input.entityId],
    );
    const ancestorRows: Row[] = chain.length
      ? await this.db.query(`${ENTITY_SQL} WHERE u.id = ANY($1::uuid[])`, [chain.map((row) => row.id)])
      : [];
    const byId = new Map(ancestorRows.map((row) => [String(row.id), row]));
    const childRows: Row[] = await this.db.query(`${ENTITY_SQL} WHERE u.parent_id = $1 AND u.is_current = true ORDER BY u.name`, [input.entityId]);
    return {
      entity: toEntity(self),
      ancestors: chain.map((row) => byId.get(row.id)).filter((row): row is Row => !!row).map(toEntity),
      children: childRows.map(toEntity),
    } as unknown as GeographyHierarchyResponseDto;
  }
}
