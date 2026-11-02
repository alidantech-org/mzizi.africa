import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { BidPublicDto } from '#/modules/procurement/dto/bid-public.dto';
import type { BidResponseDto } from '#/modules/procurement/dto/bid-response.dto';
import type { BidDto } from '#/modules/procurement/dto/bid.dto';
import type { TenderDto } from '#/modules/procurement/dto/tender.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { BidEntity } from '#/modules/procurement/entities/bid.entity';

/**
 * Get bids by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of BidEntity); review it and add business rules here.
 */
@Injectable()
export class GetBidByIdUseCase {
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

  async execute(input: { bidId: string }): Promise<BidResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.bidId } as never);
    if (!entity) throw new NotFoundException('Bid not found');
    return {
      bid: this.toReadModel(entity),
    } as unknown as BidResponseDto;
  }
}