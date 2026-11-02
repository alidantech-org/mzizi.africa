import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ClassificationRecordListQueryDto } from '#/modules/reference/dto/classification-record-list-query.dto';
import type { ClassificationRecordPublicDto } from '#/modules/reference/dto/classification-record-public.dto';
import type { ClassificationRecordDto } from '#/modules/reference/dto/classification-record.dto';
import type { ClassificationRecordsListResponseDto } from '#/modules/reference/dto/classification-records-list-response.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { ClassificationRecordEntity } from '#/modules/reference/entities/classification-record.entity';
import { listPage } from '#/read/list-page';

/**
 * List classification records.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of ClassificationRecordEntity); review it and add business rules here.
 */
@Injectable()
export class FindClassificationRecordsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ClassificationRecordEntity);
  }

  private toReadModel(entity: ClassificationRecordEntity): ClassificationRecordPublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    jurisdictionId: entity.jurisdictionId,
    label: entity.label,
    legalBasis: entity.legalBasis,
    order: entity.order,
    scheme: entity.scheme,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as ClassificationRecordPublicDto;
  }

  async execute(input: ClassificationRecordListQueryDto): Promise<ClassificationRecordsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { records: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as ClassificationRecordsListResponseDto;
  }
}
