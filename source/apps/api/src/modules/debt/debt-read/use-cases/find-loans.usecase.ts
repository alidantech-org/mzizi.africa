import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { LoanListQueryDto } from '#/modules/debt/dto/loan-list-query.dto';
import type { LoanPublicDto } from '#/modules/debt/dto/loan-public.dto';
import type { LoanDto } from '#/modules/debt/dto/loan.dto';
import type { LoansListResponseDto } from '#/modules/debt/dto/loans-list-response.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { LoanEntity } from '#/modules/debt/entities/loan.entity';
import { listPage } from '#/read/list-page';

/**
 * List loans.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of LoanEntity); review it and add business rules here.
 */
@Injectable()
export class FindLoansUseCase {
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

  async execute(input: LoanListQueryDto): Promise<LoansListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { loans: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as LoansListResponseDto;
  }
}
