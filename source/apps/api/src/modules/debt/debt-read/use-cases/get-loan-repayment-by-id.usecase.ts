import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { LoanRepaymentPublicDto } from '#/modules/debt/dto/loan-repayment-public.dto';
import type { LoanRepaymentResponseDto } from '#/modules/debt/dto/loan-repayment-response.dto';
import type { LoanRepaymentDto } from '#/modules/debt/dto/loan-repayment.dto';
import type { LoanDto } from '#/modules/debt/dto/loan.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { LoanRepaymentEntity } from '#/modules/debt/entities/loan-repayment.entity';

/**
 * Get loan repayments by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of LoanRepaymentEntity); review it and add business rules here.
 */
@Injectable()
export class GetLoanRepaymentByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(LoanRepaymentEntity);
  }

  private toReadModel(entity: LoanRepaymentEntity): LoanRepaymentPublicDto {
    return {
    createdAt: entity.createdAt,
    currencyCode: entity.currencyCode,
    feesPaid: entity.feesPaid,
    id: entity.id,
    interestPaid: entity.interestPaid,
    isCurrent: entity.isCurrent,
    ledgerEntryId: entity.ledgerEntryId,
    loanId: entity.loanId,
    paidOn: entity.paidOn,
    principalPaid: entity.principalPaid,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as LoanRepaymentPublicDto;
  }

  async execute(input: { repaymentId: string }): Promise<LoanRepaymentResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.repaymentId } as never);
    if (!entity) throw new NotFoundException('LoanRepayment not found');
    return {
      repayment: this.toReadModel(entity),
    } as unknown as LoanRepaymentResponseDto;
  }
}