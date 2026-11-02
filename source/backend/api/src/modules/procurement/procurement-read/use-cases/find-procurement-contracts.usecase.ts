import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { BudgetaryUnitDto } from '#/modules/finance/dto/budgetary-unit.dto';
import type { ProcurementContractListQueryDto } from '#/modules/procurement/dto/procurement-contract-list-query.dto';
import type { ProcurementContractPublicDto } from '#/modules/procurement/dto/procurement-contract-public.dto';
import type { ProcurementContractDto } from '#/modules/procurement/dto/procurement-contract.dto';
import type { ProcurementContractsListResponseDto } from '#/modules/procurement/dto/procurement-contracts-list-response.dto';
import type { TenderDto } from '#/modules/procurement/dto/tender.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { ProcurementContractEntity } from '#/modules/procurement/entities/procurement-contract.entity';

/**
 * List contracts.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of ProcurementContractEntity); review it and add business rules here.
 */
@Injectable()
export class FindProcurementContractsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ProcurementContractEntity);
  }

  private toReadModel(entity: ProcurementContractEntity): ProcurementContractPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    awardedEntityId: entity.awardedEntityId,
    awardedOn: entity.awardedOn,
    code: entity.code,
    confidence: entity.confidence,
    contractingOfficeId: entity.contractingOfficeId,
    contractingUnitId: entity.contractingUnitId,
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
    status: entity.status,
    tenderId: entity.tenderId,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    value: entity.value,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as ProcurementContractPublicDto;
  }

  async execute(input: ProcurementContractListQueryDto): Promise<ProcurementContractsListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.awardedEntityId !== undefined) where.awardedEntityId = input.awardedEntityId;
    if (input.contractingUnitId !== undefined) where.contractingUnitId = input.contractingUnitId;
    if (input.tenderId !== undefined) where.tenderId = input.tenderId;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<ProcurementContractEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      contracts: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as ProcurementContractsListResponseDto;
  }
}