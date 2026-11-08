import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ContractVariationListQueryDto } from '#/modules/procurement/dto/contract-variation-list-query.dto';
import type { ContractVariationPublicDto } from '#/modules/procurement/dto/contract-variation-public.dto';
import type { ContractVariationDto } from '#/modules/procurement/dto/contract-variation.dto';
import type { ContractVariationsListResponseDto } from '#/modules/procurement/dto/contract-variations-list-response.dto';
import type { ProcurementContractDto } from '#/modules/procurement/dto/procurement-contract.dto';
import type { TenderDto } from '#/modules/procurement/dto/tender.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { ContractVariationEntity } from '#/modules/procurement/entities/contract-variation.entity';
import { listPage } from '#/read/list-page';

/**
 * List contract variations.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of ContractVariationEntity); review it and add business rules here.
 */
@Injectable()
export class FindContractVariationsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ContractVariationEntity);
  }

  private toReadModel(entity: ContractVariationEntity): ContractVariationPublicDto {
    return {
    amountChange: entity.amountChange,
    approvedOn: entity.approvedOn,
    contractId: entity.contractId,
    createdAt: entity.createdAt,
    currencyCode: entity.currencyCode,
    id: entity.id,
    isCurrent: entity.isCurrent,
    reason: entity.reason,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as ContractVariationPublicDto;
  }

  async execute(input: ContractVariationListQueryDto): Promise<ContractVariationsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { variations: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as ContractVariationsListResponseDto;
  }
}
