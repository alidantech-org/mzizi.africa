import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { BudgetDto } from '#/modules/finance/dto/budget.dto';
import type { BudgetaryUnitDto } from '#/modules/finance/dto/budgetary-unit.dto';
import type { ExpenditurePublicDto } from '#/modules/finance/dto/expenditure-public.dto';
import type { ExpenditureResponseDto } from '#/modules/finance/dto/expenditure-response.dto';
import type { ExpenditureDto } from '#/modules/finance/dto/expenditure.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { ExpenditureEntity } from '#/modules/finance/entities/expenditure.entity';

/**
 * Get expenditures by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of ExpenditureEntity); review it and add business rules here.
 */
@Injectable()
export class GetExpenditureByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ExpenditureEntity);
  }

  private toReadModel(entity: ExpenditureEntity): ExpenditurePublicDto {
    return {
    amount: entity.amount,
    approverPersonId: entity.approverPersonId,
    budgetId: entity.budgetId,
    contractId: entity.contractId,
    createdAt: entity.createdAt,
    currencyCode: entity.currencyCode,
    id: entity.id,
    isCurrent: entity.isCurrent,
    stageId: entity.stageId,
    stageOrder: entity.stageOrder,
    unitId: entity.unitId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as ExpenditurePublicDto;
  }

  async execute(input: { expenditureId: string }): Promise<ExpenditureResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.expenditureId } as never);
    if (!entity) throw new NotFoundException('Expenditure not found');
    return {
      expenditure: this.toReadModel(entity),
    } as unknown as ExpenditureResponseDto;
  }
}