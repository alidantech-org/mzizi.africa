import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { VintageListQueryDto } from '#/modules/statistics/dto/vintage-list-query.dto';
import type { VintagePublicDto } from '#/modules/statistics/dto/vintage-public.dto';
import type { VintageDto } from '#/modules/statistics/dto/vintage.dto';
import type { VintagesListResponseDto } from '#/modules/statistics/dto/vintages-list-response.dto';
import { VintageEntity } from '#/modules/statistics/entities/vintage.entity';
import { listPage } from '#/read/list-page';

/**
 * List release vintages.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of VintageEntity); review it and add business rules here.
 */
@Injectable()
export class FindVintagesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(VintageEntity);
  }

  private toReadModel(entity: VintageEntity): VintagePublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    label: entity.label,
    publisherInstitutionId: entity.publisherInstitutionId,
    releasedOn: entity.releasedOn,
    supersedesId: entity.supersedesId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as VintagePublicDto;
  }

  async execute(input: VintageListQueryDto): Promise<VintagesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { vintages: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as VintagesListResponseDto;
  }
}
