import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { LoanDisbursementListQueryDto } from '#/modules/debt/dto/loan-disbursement-list-query.dto';
import type { LoanDisbursementPublicDto } from '#/modules/debt/dto/loan-disbursement-public.dto';
import type { LoanDisbursementDto } from '#/modules/debt/dto/loan-disbursement.dto';
import type { LoanDisbursementsListResponseDto } from '#/modules/debt/dto/loan-disbursements-list-response.dto';
import type { LoanDto } from '#/modules/debt/dto/loan.dto';
import type { BudgetaryUnitDto } from '#/modules/finance/dto/budgetary-unit.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { LoanDisbursementEntity } from '#/modules/debt/entities/loan-disbursement.entity';

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

  async execute(input: LoanDisbursementListQueryDto): Promise<LoanDisbursementsListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.loanId !== undefined) where.loanId = input.loanId;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<LoanDisbursementEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      disbursements: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as LoanDisbursementsListResponseDto;
  }
}