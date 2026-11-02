import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { LoanDisbursementPublicDto } from '#/modules/debt/dto/loan-disbursement-public.dto';
import type { LoanDisbursementResponseDto } from '#/modules/debt/dto/loan-disbursement-response.dto';
import type { LoanDisbursementDto } from '#/modules/debt/dto/loan-disbursement.dto';
import type { LoanDto } from '#/modules/debt/dto/loan.dto';
import type { BudgetaryUnitDto } from '#/modules/finance/dto/budgetary-unit.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { LoanDisbursementEntity } from '#/modules/debt/entities/loan-disbursement.entity';

/**
 * Get loan disbursements by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of LoanDisbursementEntity); review it and add business rules here.
 */
@Injectable()
export class GetLoanDisbursementByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(LoanDisbursementEntity);
  }

  private toReadModel(entity: LoanDisbursementEntity): LoanDisbursementPublicDto {
    return {
    amount: entity.amount,
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    currencyCode: entity.currencyCode,
    disbursedOn: entity.disbursedOn,
    id: entity.id,
    isCurrent: entity.isCurrent,
    ledgerEntryId: entity.ledgerEntryId,
    licence: entity.licence,
    loanId: entity.loanId,
    method: entity.method,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as LoanDisbursementPublicDto;
  }

  async execute(input: { disbursementId: string }): Promise<LoanDisbursementResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.disbursementId } as never);
    if (!entity) throw new NotFoundException('LoanDisbursement not found');
    return {
      disbursement: this.toReadModel(entity),
    } as unknown as LoanDisbursementResponseDto;
  }
}