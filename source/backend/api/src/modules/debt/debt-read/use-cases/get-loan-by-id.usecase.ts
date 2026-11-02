import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { LoanPublicDto } from '#/modules/debt/dto/loan-public.dto';
import type { LoanResponseDto } from '#/modules/debt/dto/loan-response.dto';
import type { LoanDto } from '#/modules/debt/dto/loan.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
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
    borrowerUnitId: entity.borrowerUnitId,
    code: entity.code,
    createdAt: entity.createdAt,
    currencyCode: entity.currencyCode,
    id: entity.id,
    interestRate: entity.interestRate,
    isCurrent: entity.isCurrent,
    legalBasisId: entity.legalBasisId,
    lenderEntityId: entity.lenderEntityId,
    principalAmount: entity.principalAmount,
    status: entity.status,
    termMonths: entity.termMonths,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
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