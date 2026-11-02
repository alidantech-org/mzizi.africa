import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { BudgetaryUnitDto } from '#/modules/finance/dto/budgetary-unit.dto';
import type { ContractMilestoneListQueryDto } from '#/modules/procurement/dto/contract-milestone-list-query.dto';
import type { ContractMilestonePublicDto } from '#/modules/procurement/dto/contract-milestone-public.dto';
import type { ContractMilestoneDto } from '#/modules/procurement/dto/contract-milestone.dto';
import type { ContractMilestonesListResponseDto } from '#/modules/procurement/dto/contract-milestones-list-response.dto';
import type { ProcurementContractDto } from '#/modules/procurement/dto/procurement-contract.dto';
import type { TenderDto } from '#/modules/procurement/dto/tender.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { ContractMilestoneEntity } from '#/modules/procurement/entities/contract-milestone.entity';
import { listPage } from '#/read/list-page';

/**
 * List contract milestones.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of ContractMilestoneEntity); review it and add business rules here.
 */
@Injectable()
export class FindContractMilestonesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ContractMilestoneEntity);
  }

  private toReadModel(entity: ContractMilestoneEntity): ContractMilestonePublicDto {
    return {
    amount: entity.amount,
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    completedOn: entity.completedOn,
    confidence: entity.confidence,
    contractId: entity.contractId,
    createdAt: entity.createdAt,
    currencyCode: entity.currencyCode,
    dueOn: entity.dueOn,
    id: entity.id,
    isCurrent: entity.isCurrent,
    licence: entity.licence,
    method: entity.method,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    title: entity.title,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as ContractMilestonePublicDto;
  }

  async execute(input: ContractMilestoneListQueryDto): Promise<ContractMilestonesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { milestones: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as ContractMilestonesListResponseDto;
  }
}
