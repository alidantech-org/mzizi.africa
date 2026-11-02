import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { LoanPublicDto } from '#/modules/debt/dto/loan-public.dto';
import type { LoanResponseDto } from '#/modules/debt/dto/loan-response.dto';
import type { LoanDto } from '#/modules/debt/dto/loan.dto';
import type { BudgetaryUnitDto } from '#/modules/finance/dto/budgetary-unit.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { LoanEntity } from '#/modules/debt/entities/loan.entity';

/**
 * Get loans by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of LoanEntity); review it and add business rules here.
 */
@Injectable()
export class GetLoanByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(LoanEntity);
  }

  private toReadModel(entity: LoanEntity): LoanPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    borrowerUnitId: entity.borrowerUnitId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    currencyCode: entity.currencyCode,
    id: entity.id,
    interestRate: entity.interestRate,
    isCurrent: entity.isCurrent,
    legalBasisId: entity.legalBasisId,
    lenderEntityId: entity.lenderEntityId,
    licence: entity.licence,
    method: entity.method,
    principalAmount: entity.principalAmount,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    status: entity.status,
    termMonths: entity.termMonths,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as LoanPublicDto;
  }

  async execute(input: { loanId: string }): Promise<LoanResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.loanId } as never);
    if (!entity) throw new NotFoundException('Loan not found');
    return {
      loan: this.toReadModel(entity),
    } as unknown as LoanResponseDto;
  }
}