import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { BudgetaryUnitDto } from '#/modules/finance/dto/budgetary-unit.dto';
import type { RevenueRecordPublicDto } from '#/modules/finance/dto/revenue-record-public.dto';
import type { RevenueRecordResponseDto } from '#/modules/finance/dto/revenue-record-response.dto';
import type { RevenueRecordDto } from '#/modules/finance/dto/revenue-record.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { RevenueRecordEntity } from '#/modules/finance/entities/revenue-record.entity';

/**
 * Get revenue records by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of RevenueRecordEntity); review it and add business rules here.
 */
@Injectable()
export class GetRevenueRecordByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(RevenueRecordEntity);
  }

  private toReadModel(entity: RevenueRecordEntity): RevenueRecordPublicDto {
    return {
    amount: entity.amount,
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    categoryId: entity.categoryId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    currencyCode: entity.currencyCode,
    fiscalYearId: entity.fiscalYearId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    licence: entity.licence,
    method: entity.method,
    payerEntityId: entity.payerEntityId,
    receivedOn: entity.receivedOn,
    restriction: entity.restriction,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    toolOrModel: entity.toolOrModel,
    unitId: entity.unitId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as RevenueRecordPublicDto;
  }

  async execute(input: { revenueId: string }): Promise<RevenueRecordResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.revenueId } as never);
    if (!entity) throw new NotFoundException('RevenueRecord not found');
    return {
      revenue: this.toReadModel(entity),
    } as unknown as RevenueRecordResponseDto;
  }
}