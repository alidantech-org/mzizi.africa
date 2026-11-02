import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ENTITY_SQL, CURRENT_VERIFIED_BOUNDARY_SQL, toEntity, toFeature, type Row } from '#/modules/geography/geography-read/geography-read.queries';
import type { GeographyHistoryResponseDto } from '#/modules/geography/dto/geography-history-response.dto';

/**
 * Scaffolded by Dryv once; this file belongs to the project.
 */
@Injectable()
export class GetGeographyHistoryUseCase {
  constructor(@InjectDataSource() private readonly db: DataSource) {}

  async execute(input: { entityId: string }): Promise<GeographyHistoryResponseDto> {
    const [self]: Row[] = await this.db.query(`SELECT id FROM geo_units WHERE id = $1`, [input.entityId]);
    if (!self) throw new NotFoundException('geography entity not found');
    const names: Row[] = await this.db.query(
      `SELECT * FROM geo_unit_name_versions WHERE unit_id = $1 ORDER BY valid_from NULLS FIRST, created_at`,
      [input.entityId],
    );
    const changes: Row[] = await this.db.query(
      `SELECT * FROM geo_unit_changes WHERE source_unit_id = $1 OR target_unit_id = $1 ORDER BY valid_from NULLS FIRST, created_at`,
      [input.entityId],
    );
    const camel = (row: Row) => Object.fromEntries(Object.entries(row).map(([key, value]) => [key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase()), value]));
    return { names: names.map(camel), changes: changes.map(camel) } as unknown as GeographyHistoryResponseDto;
  }
}
