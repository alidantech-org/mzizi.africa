import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { StatisticsTablePublicDto } from '#/modules/statistics/dto/statistics-table-public.dto';
import type { StatisticsTableResponseDto } from '#/modules/statistics/dto/statistics-table-response.dto';
import type { StatisticsTableDto } from '#/modules/statistics/dto/statistics-table.dto';
import { StatisticsTableEntity } from '#/modules/statistics/entities/statistics-table.entity';

/**
 * Get statistics tables by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of StatisticsTableEntity); review it and add business rules here.
 */
@Injectable()
export class GetStatisticsTableByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(StatisticsTableEntity);
  }

  private toReadModel(entity: StatisticsTableEntity): StatisticsTablePublicDto {
    return {
    code: entity.code,
    collector: entity.collector,
    createdAt: entity.createdAt,
    geoUnitId: entity.geoUnitId,
    id: entity.id,
    indicatorId: entity.indicatorId,
    isCurrent: entity.isCurrent,
    jurisdictionId: entity.jurisdictionId,
    methodology: entity.methodology,
    publisherInstitutionId: entity.publisherInstitutionId,
    title: entity.title,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as StatisticsTablePublicDto;
  }

  async execute(input: { tableId: string }): Promise<StatisticsTableResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.tableId } as never);
    if (!entity) throw new NotFoundException('StatisticsTable not found');
    return {
      table: this.toReadModel(entity),
    } as unknown as StatisticsTableResponseDto;
  }
}