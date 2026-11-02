import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { BudgetPublicDto } from '#/modules/finance/dto/budget-public.dto';
import type { BudgetResponseDto } from '#/modules/finance/dto/budget-response.dto';
import type { BudgetDto } from '#/modules/finance/dto/budget.dto';
import type { BudgetaryUnitDto } from '#/modules/finance/dto/budgetary-unit.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { BudgetEntity } from '#/modules/finance/entities/budget.entity';

/**
 * Get budgets by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of BudgetEntity); review it and add business rules here.
 */
@Injectable()
export class GetBudgetByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(BudgetEntity);
  }

  private toReadModel(entity: BudgetEntity): BudgetPublicDto {
    return {
    approvedAmount: entity.approvedAmount,
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    currencyCode: entity.currencyCode,
    fiscalYearId: entity.fiscalYearId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    kind: entity.kind,
    legalBasisId: entity.legalBasisId,
    licence: entity.licence,
    method: entity.method,
    programCode: entity.programCode,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    toolOrModel: entity.toolOrModel,
    unitId: entity.unitId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as BudgetPublicDto;
  }

  async execute(input: { budgetId: string }): Promise<BudgetResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.budgetId } as never);
    if (!entity) throw new NotFoundException('Budget not found');
    return {
      budget: this.toReadModel(entity),
    } as unknown as BudgetResponseDto;
  }
}