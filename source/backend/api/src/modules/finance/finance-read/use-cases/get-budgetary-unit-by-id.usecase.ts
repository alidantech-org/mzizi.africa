import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { BudgetaryUnitPublicDto } from '#/modules/finance/dto/budgetary-unit-public.dto';
import type { BudgetaryUnitResponseDto } from '#/modules/finance/dto/budgetary-unit-response.dto';
import type { BudgetaryUnitDto } from '#/modules/finance/dto/budgetary-unit.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { BudgetaryUnitEntity } from '#/modules/finance/entities/budgetary-unit.entity';

/**
 * Get budgetary units by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of BudgetaryUnitEntity); review it and add business rules here.
 */
@Injectable()
export class GetBudgetaryUnitByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(BudgetaryUnitEntity);
  }

  private toReadModel(entity: BudgetaryUnitEntity): BudgetaryUnitPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    geoUnitId: entity.geoUnitId,
    id: entity.id,
    institutionId: entity.institutionId,
    isCurrent: entity.isCurrent,
    jurisdictionId: entity.jurisdictionId,
    legalEntityId: entity.legalEntityId,
    levelId: entity.levelId,
    licence: entity.licence,
    method: entity.method,
    name: entity.name,
    parentUnitId: entity.parentUnitId,
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
    } as unknown as BudgetaryUnitPublicDto;
  }

  async execute(input: { unitId: string }): Promise<BudgetaryUnitResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.unitId } as never);
    if (!entity) throw new NotFoundException('BudgetaryUnit not found');
    return {
      unit: this.toReadModel(entity),
    } as unknown as BudgetaryUnitResponseDto;
  }
}