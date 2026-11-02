import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { BudgetaryUnitDto } from '#/modules/finance/dto/budgetary-unit.dto';
import type { TenderPublicDto } from '#/modules/procurement/dto/tender-public.dto';
import type { TenderResponseDto } from '#/modules/procurement/dto/tender-response.dto';
import type { TenderDto } from '#/modules/procurement/dto/tender.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { TenderEntity } from '#/modules/procurement/entities/tender.entity';

/**
 * Get tenders by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of TenderEntity); review it and add business rules here.
 */
@Injectable()
export class GetTenderByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(TenderEntity);
  }

  private toReadModel(entity: TenderEntity): TenderPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    budgetId: entity.budgetId,
    closesOn: entity.closesOn,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    currencyCode: entity.currencyCode,
    estimatedValue: entity.estimatedValue,
    id: entity.id,
    isCurrent: entity.isCurrent,
    issuingUnitId: entity.issuingUnitId,
    kindId: entity.kindId,
    legalBasisId: entity.legalBasisId,
    licence: entity.licence,
    method: entity.method,
    methodId: entity.methodId,
    procuringOfficeId: entity.procuringOfficeId,
    publishedOn: entity.publishedOn,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    status: entity.status,
    title: entity.title,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as TenderPublicDto;
  }

  async execute(input: { tenderId: string }): Promise<TenderResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.tenderId } as never);
    if (!entity) throw new NotFoundException('Tender not found');
    return {
      tender: this.toReadModel(entity),
    } as unknown as TenderResponseDto;
  }
}