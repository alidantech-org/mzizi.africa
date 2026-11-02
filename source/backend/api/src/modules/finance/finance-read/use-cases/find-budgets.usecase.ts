import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { BudgetListQueryDto } from '#/modules/finance/dto/budget-list-query.dto';
import type { BudgetPublicDto } from '#/modules/finance/dto/budget-public.dto';
import type { BudgetDto } from '#/modules/finance/dto/budget.dto';
import type { BudgetaryUnitDto } from '#/modules/finance/dto/budgetary-unit.dto';
import type { BudgetsListResponseDto } from '#/modules/finance/dto/budgets-list-response.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { BudgetEntity } from '#/modules/finance/entities/budget.entity';
import { listPage } from '#/read/list-page';

/**
 * List budgets.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of BudgetEntity); review it and add business rules here.
 */
@Injectable()
export class FindBudgetsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(BudgetEntity);
  }

  private toReadModel(entity: BudgetEntity): BudgetPublicDto {
    return {
    approvedAmount: entity.approvedAmount,
    createdAt: entity.createdAt,
    currencyCode: entity.currencyCode,
    fiscalYearId: entity.fiscalYearId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    kind: entity.kind,
    legalBasisId: entity.legalBasisId,
    programCode: entity.programCode,
    unitId: entity.unitId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as BudgetPublicDto;
  }

  async execute(input: BudgetListQueryDto): Promise<BudgetsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { budgets: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as BudgetsListResponseDto;
  }
}
