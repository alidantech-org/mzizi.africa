import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ContractMilestonePublicDto } from '#/modules/procurement/dto/contract-milestone-public.dto';
import type { ContractMilestoneResponseDto } from '#/modules/procurement/dto/contract-milestone-response.dto';
import type { ContractMilestoneDto } from '#/modules/procurement/dto/contract-milestone.dto';
import type { ProcurementContractDto } from '#/modules/procurement/dto/procurement-contract.dto';
import type { TenderDto } from '#/modules/procurement/dto/tender.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { ContractMilestoneEntity } from '#/modules/procurement/entities/contract-milestone.entity';

/**
 * Get contract milestones by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of ContractMilestoneEntity); review it and add business rules here.
 */
@Injectable()
export class GetContractMilestoneByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ContractMilestoneEntity);
  }

  private toReadModel(entity: ContractMilestoneEntity): ContractMilestonePublicDto {
    return {
    amount: entity.amount,
    completedOn: entity.completedOn,
    contractId: entity.contractId,
    createdAt: entity.createdAt,
    currencyCode: entity.currencyCode,
    dueOn: entity.dueOn,
    id: entity.id,
    isCurrent: entity.isCurrent,
    title: entity.title,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as ContractMilestonePublicDto;
  }

  async execute(input: { milestoneId: string }): Promise<ContractMilestoneResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.milestoneId } as never);
    if (!entity) throw new NotFoundException('ContractMilestone not found');
    return {
      milestone: this.toReadModel(entity),
    } as unknown as ContractMilestoneResponseDto;
  }
}