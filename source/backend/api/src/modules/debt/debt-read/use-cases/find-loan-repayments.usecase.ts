import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { LoanRepaymentListQueryDto } from '#/modules/debt/dto/loan-repayment-list-query.dto';
import type { LoanRepaymentPublicDto } from '#/modules/debt/dto/loan-repayment-public.dto';
import type { LoanRepaymentDto } from '#/modules/debt/dto/loan-repayment.dto';
import type { LoanRepaymentsListResponseDto } from '#/modules/debt/dto/loan-repayments-list-response.dto';
import type { LoanDto } from '#/modules/debt/dto/loan.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { LoanRepaymentEntity } from '#/modules/debt/entities/loan-repayment.entity';
import { listPage } from '#/read/list-page';

/**
 * List loan repayments.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of LoanRepaymentEntity); review it and add business rules here.
 */
@Injectable()
export class FindLoanRepaymentsUseCase {
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

  async execute(input: LoanRepaymentListQueryDto): Promise<LoanRepaymentsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { repayments: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as LoanRepaymentsListResponseDto;
  }
}
