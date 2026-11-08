import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ProcurementContractListQueryDto } from '#/modules/procurement/dto/procurement-contract-list-query.dto';
import type { ProcurementContractPublicDto } from '#/modules/procurement/dto/procurement-contract-public.dto';
import type { ProcurementContractDto } from '#/modules/procurement/dto/procurement-contract.dto';
import type { ProcurementContractsListResponseDto } from '#/modules/procurement/dto/procurement-contracts-list-response.dto';
import type { TenderDto } from '#/modules/procurement/dto/tender.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { ProcurementContractEntity } from '#/modules/procurement/entities/procurement-contract.entity';
import { listPage } from '#/read/list-page';

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
    awardedEntityId: entity.awardedEntityId,
    awardedOn: entity.awardedOn,
    code: entity.code,
    contractingOfficeId: entity.contractingOfficeId,
    contractingUnitId: entity.contractingUnitId,
    createdAt: entity.createdAt,
    currencyCode: entity.currencyCode,
    id: entity.id,
    isCurrent: entity.isCurrent,
    status: entity.status,
    tenderId: entity.tenderId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    value: entity.value,
    version: entity.version,
    } as unknown as ProcurementContractPublicDto;
  }

  async execute(input: ProcurementContractListQueryDto): Promise<ProcurementContractsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { contracts: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as ProcurementContractsListResponseDto;
  }
}
