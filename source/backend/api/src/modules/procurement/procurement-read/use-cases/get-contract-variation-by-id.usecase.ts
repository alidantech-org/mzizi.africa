import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ContractVariationPublicDto } from '#/modules/procurement/dto/contract-variation-public.dto';
import type { ContractVariationResponseDto } from '#/modules/procurement/dto/contract-variation-response.dto';
import type { ContractVariationDto } from '#/modules/procurement/dto/contract-variation.dto';
import type { ProcurementContractDto } from '#/modules/procurement/dto/procurement-contract.dto';
import type { TenderDto } from '#/modules/procurement/dto/tender.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { ContractVariationEntity } from '#/modules/procurement/entities/contract-variation.entity';

/**
 * Get contract variations by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of ContractVariationEntity); review it and add business rules here.
 */
@Injectable()
export class GetContractVariationByIdUseCase {
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

  async execute(input: { variationId: string }): Promise<ContractVariationResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.variationId } as never);
    if (!entity) throw new NotFoundException('ContractVariation not found');
    return {
      variation: this.toReadModel(entity),
    } as unknown as ContractVariationResponseDto;
  }
}