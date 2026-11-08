import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { BudgetaryUnitDto } from '#/modules/finance/dto/budgetary-unit.dto';
import type { TransferListQueryDto } from '#/modules/finance/dto/transfer-list-query.dto';
import type { TransferPublicDto } from '#/modules/finance/dto/transfer-public.dto';
import type { TransferDto } from '#/modules/finance/dto/transfer.dto';
import type { TransfersListResponseDto } from '#/modules/finance/dto/transfers-list-response.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { TransferEntity } from '#/modules/finance/entities/transfer.entity';
import { listPage } from '#/read/list-page';

/**
 * List transfers.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of TransferEntity); review it and add business rules here.
 */
@Injectable()
export class FindTransfersUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(TransferEntity);
  }

  private toReadModel(entity: TransferEntity): TransferPublicDto {
    return {
    amount: entity.amount,
    createdAt: entity.createdAt,
    currencyCode: entity.currencyCode,
    fiscalYearId: entity.fiscalYearId,
    fromUnitId: entity.fromUnitId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    legalBasisId: entity.legalBasisId,
    restriction: entity.restriction,
    status: entity.status,
    toUnitId: entity.toUnitId,
    transferTypeId: entity.transferTypeId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as TransferPublicDto;
  }

  async execute(input: TransferListQueryDto): Promise<TransfersListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { transfers: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as TransfersListResponseDto;
  }
}
