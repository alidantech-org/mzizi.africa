import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { TenderPublicDto } from '#/modules/procurement/dto/tender-public.dto';
import type { TenderResponseDto } from '#/modules/procurement/dto/tender-response.dto';
import type { TenderDto } from '#/modules/procurement/dto/tender.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
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
    budgetId: entity.budgetId,
    closesOn: entity.closesOn,
    code: entity.code,
    createdAt: entity.createdAt,
    currencyCode: entity.currencyCode,
    estimatedValue: entity.estimatedValue,
    id: entity.id,
    isCurrent: entity.isCurrent,
    issuingUnitId: entity.issuingUnitId,
    kindId: entity.kindId,
    legalBasisId: entity.legalBasisId,
    methodId: entity.methodId,
    procuringOfficeId: entity.procuringOfficeId,
    publishedOn: entity.publishedOn,
    status: entity.status,
    title: entity.title,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
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