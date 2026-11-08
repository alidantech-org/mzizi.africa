import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { TenderListQueryDto } from '#/modules/procurement/dto/tender-list-query.dto';
import type { TenderPublicDto } from '#/modules/procurement/dto/tender-public.dto';
import type { TenderDto } from '#/modules/procurement/dto/tender.dto';
import type { TendersListResponseDto } from '#/modules/procurement/dto/tenders-list-response.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { TenderEntity } from '#/modules/procurement/entities/tender.entity';
import { listPage } from '#/read/list-page';

/**
 * List tenders.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of TenderEntity); review it and add business rules here.
 */
@Injectable()
export class FindTendersUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(TenderEntity);
  }

  private toReadModel(entity: TenderEntity): TenderPublicDto {
    return {
    budgetId: entity.budgetId,
    closesOn: entity.closesOn,
    code: entity.code,
    createdAt: entity.createdAt,
    currencyCode: entity.currencyCode,
    estimatedValue: entity.estimatedValue,
    id: entity.id,
    isCurrent: entity.isCurrent,
    issuingUnitId: entity.issuingUnitId,
    kindId: entity.kindId,
    legalBasisId: entity.legalBasisId,
    methodId: entity.methodId,
    procuringOfficeId: entity.procuringOfficeId,
    publishedOn: entity.publishedOn,
    status: entity.status,
    title: entity.title,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as TenderPublicDto;
  }

  async execute(input: TenderListQueryDto): Promise<TendersListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { tenders: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as TendersListResponseDto;
  }
}
