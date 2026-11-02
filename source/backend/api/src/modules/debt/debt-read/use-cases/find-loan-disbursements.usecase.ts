import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { LoanDisbursementListQueryDto } from '#/modules/debt/dto/loan-disbursement-list-query.dto';
import type { LoanDisbursementPublicDto } from '#/modules/debt/dto/loan-disbursement-public.dto';
import type { LoanDisbursementDto } from '#/modules/debt/dto/loan-disbursement.dto';
import type { LoanDisbursementsListResponseDto } from '#/modules/debt/dto/loan-disbursements-list-response.dto';
import type { LoanDto } from '#/modules/debt/dto/loan.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { LoanDisbursementEntity } from '#/modules/debt/entities/loan-disbursement.entity';
import { listPage } from '#/read/list-page';

/**
 * List loan disbursements.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of LoanDisbursementEntity); review it and add business rules here.
 */
@Injectable()
export class FindLoanDisbursementsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(LoanDisbursementEntity);
  }

  private toReadModel(entity: LoanDisbursementEntity): LoanDisbursementPublicDto {
    return {
    amount: entity.amount,
    createdAt: entity.createdAt,
    currencyCode: entity.currencyCode,
    disbursedOn: entity.disbursedOn,
    id: entity.id,
    isCurrent: entity.isCurrent,
    ledgerEntryId: entity.ledgerEntryId,
    loanId: entity.loanId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as LoanDisbursementPublicDto;
  }

  async execute(input: LoanDisbursementListQueryDto): Promise<LoanDisbursementsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { disbursements: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as LoanDisbursementsListResponseDto;
  }
}
