import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { LoanListQueryDto } from '#/modules/debt/dto/loan-list-query.dto';
import type { LoanPublicDto } from '#/modules/debt/dto/loan-public.dto';
import type { LoanDto } from '#/modules/debt/dto/loan.dto';
import type { LoansListResponseDto } from '#/modules/debt/dto/loans-list-response.dto';
import type { BudgetaryUnitDto } from '#/modules/finance/dto/budgetary-unit.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { LoanEntity } from '#/modules/debt/entities/loan.entity';

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

  async execute(input: LoanListQueryDto): Promise<LoansListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.borrowerUnitId !== undefined) where.borrowerUnitId = input.borrowerUnitId;
    if (input.lenderEntityId !== undefined) where.lenderEntityId = input.lenderEntityId;
    if (input.status !== undefined) where.status = input.status;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<LoanEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      loans: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as LoansListResponseDto;
  }
}