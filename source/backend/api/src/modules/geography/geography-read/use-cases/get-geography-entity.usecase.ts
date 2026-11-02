import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ENTITY_SQL, CURRENT_VERIFIED_BOUNDARY_SQL, toEntity, toFeature, type Row } from '#/modules/geography/geography-read/geography-read.queries';
import type { GeographyEntityDto } from '#/modules/geography/dto/geography-entity.dto';

/**
 * Scaffolded by Dryv once; this file belongs to the project.
 */
@Injectable()
export class GetGeographyEntityUseCase {
  constructor(@InjectDataSource() private readonly db: DataSource) {}

  async execute(input: { entityId: string }): Promise<GeographyEntityDto> {
    const [row]: Row[] = await this.db.query(`${ENTITY_SQL} WHERE u.id = $1`, [input.entityId]);
    if (!row) throw new NotFoundException('geography entity not found');
    return toEntity(row);
  }
}
