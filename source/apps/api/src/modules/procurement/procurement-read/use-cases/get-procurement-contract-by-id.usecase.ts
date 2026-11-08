import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ProcurementContractPublicDto } from '#/modules/procurement/dto/procurement-contract-public.dto';
import type { ProcurementContractResponseDto } from '#/modules/procurement/dto/procurement-contract-response.dto';
import type { ProcurementContractDto } from '#/modules/procurement/dto/procurement-contract.dto';
import type { TenderDto } from '#/modules/procurement/dto/tender.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { ProcurementContractEntity } from '#/modules/procurement/entities/procurement-contract.entity';

/**
 * Get contracts by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of ProcurementContractEntity); review it and add business rules here.
 */
@Injectable()
export class GetProcurementContractByIdUseCase {
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

  async execute(input: { contractId: string }): Promise<ProcurementContractResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.contractId } as never);
    if (!entity) throw new NotFoundException('ProcurementContract not found');
    return {
      contract: this.toReadModel(entity),
    } as unknown as ProcurementContractResponseDto;
  }
}