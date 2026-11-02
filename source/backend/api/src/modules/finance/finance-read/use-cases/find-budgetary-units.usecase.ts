import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { BudgetaryUnitListQueryDto } from '#/modules/finance/dto/budgetary-unit-list-query.dto';
import type { BudgetaryUnitPublicDto } from '#/modules/finance/dto/budgetary-unit-public.dto';
import type { BudgetaryUnitDto } from '#/modules/finance/dto/budgetary-unit.dto';
import type { BudgetaryUnitsListResponseDto } from '#/modules/finance/dto/budgetary-units-list-response.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { BudgetaryUnitEntity } from '#/modules/finance/entities/budgetary-unit.entity';

/**
 * List budgetary units.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of BudgetaryUnitEntity); review it and add business rules here.
 */
@Injectable()
export class FindBudgetaryUnitsUseCase {
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

  async execute(input: BudgetaryUnitListQueryDto): Promise<BudgetaryUnitsListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.jurisdictionId !== undefined) where.jurisdictionId = input.jurisdictionId;
    if (input.parentUnitId !== undefined) where.parentUnitId = input.parentUnitId;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<BudgetaryUnitEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      units: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as BudgetaryUnitsListResponseDto;
  }
}