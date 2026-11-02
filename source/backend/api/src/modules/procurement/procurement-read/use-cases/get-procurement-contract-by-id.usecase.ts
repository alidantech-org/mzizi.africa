import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { BudgetaryUnitDto } from '#/modules/finance/dto/budgetary-unit.dto';
import type { ProcurementContractPublicDto } from '#/modules/procurement/dto/procurement-contract-public.dto';
import type { ProcurementContractResponseDto } from '#/modules/procurement/dto/procurement-contract-response.dto';
import type { ProcurementContractDto } from '#/modules/procurement/dto/procurement-contract.dto';
import type { TenderDto } from '#/modules/procurement/dto/tender.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
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

  async execute(input: { contractId: string }): Promise<ProcurementContractResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.contractId } as never);
    if (!entity) throw new NotFoundException('ProcurementContract not found');
    return {
      contract: this.toReadModel(entity),
    } as unknown as ProcurementContractResponseDto;
  }
}