import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { BidListQueryDto } from '#/modules/procurement/dto/bid-list-query.dto';
import type { BidPublicDto } from '#/modules/procurement/dto/bid-public.dto';
import type { BidDto } from '#/modules/procurement/dto/bid.dto';
import type { BidsListResponseDto } from '#/modules/procurement/dto/bids-list-response.dto';
import type { TenderDto } from '#/modules/procurement/dto/tender.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { BidEntity } from '#/modules/procurement/entities/bid.entity';
import { listPage } from '#/read/list-page';

/**
 * List bids.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of BidEntity); review it and add business rules here.
 */
@Injectable()
export class FindBidsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(BidEntity);
  }

  private toReadModel(entity: BidEntity): BidPublicDto {
    return {
    amount: entity.amount,
    bidderEntityId: entity.bidderEntityId,
    createdAt: entity.createdAt,
    currencyCode: entity.currencyCode,
    evaluationNote: entity.evaluationNote,
    id: entity.id,
    isCompliant: entity.isCompliant,
    isCurrent: entity.isCurrent,
    status: entity.status,
    submittedOn: entity.submittedOn,
    tenderId: entity.tenderId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as BidPublicDto;
  }

  async execute(input: BidListQueryDto): Promise<BidsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { bids: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as BidsListResponseDto;
  }
}
