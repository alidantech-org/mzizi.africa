import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { BudgetaryUnitDto } from '#/modules/finance/dto/budgetary-unit.dto';
import type { TransferPublicDto } from '#/modules/finance/dto/transfer-public.dto';
import type { TransferResponseDto } from '#/modules/finance/dto/transfer-response.dto';
import type { TransferDto } from '#/modules/finance/dto/transfer.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { TransferEntity } from '#/modules/finance/entities/transfer.entity';

/**
 * Get transfers by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of TransferEntity); review it and add business rules here.
 */
@Injectable()
export class GetTransferByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(TransferEntity);
  }

  private toReadModel(entity: TransferEntity): TransferPublicDto {
    return {
    amount: entity.amount,
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    currencyCode: entity.currencyCode,
    fiscalYearId: entity.fiscalYearId,
    fromUnitId: entity.fromUnitId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    legalBasisId: entity.legalBasisId,
    licence: entity.licence,
    method: entity.method,
    restriction: entity.restriction,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    status: entity.status,
    toUnitId: entity.toUnitId,
    toolOrModel: entity.toolOrModel,
    transferTypeId: entity.transferTypeId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as TransferPublicDto;
  }

  async execute(input: { transferId: string }): Promise<TransferResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.transferId } as never);
    if (!entity) throw new NotFoundException('Transfer not found');
    return {
      transfer: this.toReadModel(entity),
    } as unknown as TransferResponseDto;
  }
}