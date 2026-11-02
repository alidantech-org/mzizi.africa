import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { BudgetDto } from '#/modules/finance/dto/budget.dto';
import type { BudgetaryUnitDto } from '#/modules/finance/dto/budgetary-unit.dto';
import type { ExpenditureListQueryDto } from '#/modules/finance/dto/expenditure-list-query.dto';
import type { ExpenditurePublicDto } from '#/modules/finance/dto/expenditure-public.dto';
import type { ExpenditureDto } from '#/modules/finance/dto/expenditure.dto';
import type { ExpendituresListResponseDto } from '#/modules/finance/dto/expenditures-list-response.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { ExpenditureEntity } from '#/modules/finance/entities/expenditure.entity';

/**
 * List expenditures.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of ExpenditureEntity); review it and add business rules here.
 */
@Injectable()
export class FindExpendituresUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ExpenditureEntity);
  }

  private toReadModel(entity: ExpenditureEntity): ExpenditurePublicDto {
    return {
    amount: entity.amount,
    approverPersonId: entity.approverPersonId,
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    budgetId: entity.budgetId,
    confidence: entity.confidence,
    contractId: entity.contractId,
    createdAt: entity.createdAt,
    currencyCode: entity.currencyCode,
    id: entity.id,
    isCurrent: entity.isCurrent,
    licence: entity.licence,
    method: entity.method,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    stageId: entity.stageId,
    stageOrder: entity.stageOrder,
    toolOrModel: entity.toolOrModel,
    unitId: entity.unitId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as ExpenditurePublicDto;
  }

  async execute(input: ExpenditureListQueryDto): Promise<ExpendituresListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.budgetId !== undefined) where.budgetId = input.budgetId;
    if (input.stageId !== undefined) where.stageId = input.stageId;
    if (input.unitId !== undefined) where.unitId = input.unitId;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<ExpenditureEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      expenditures: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as ExpendituresListResponseDto;
  }
}