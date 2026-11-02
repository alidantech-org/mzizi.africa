import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { LegalInstrumentPublicDto } from '#/modules/legal/dto/legal-instrument-public.dto';
import type { LegalInstrumentResponseDto } from '#/modules/legal/dto/legal-instrument-response.dto';
import type { LegalInstrumentDto } from '#/modules/legal/dto/legal-instrument.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { LegalInstrumentEntity } from '#/modules/legal/entities/legal-instrument.entity';

/**
 * Get legal instruments by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of LegalInstrumentEntity); review it and add business rules here.
 */
@Injectable()
export class GetLegalInstrumentByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(LegalInstrumentEntity);
  }

  private toReadModel(entity: LegalInstrumentEntity): LegalInstrumentPublicDto {
    return {
    code: entity.code,
    contentHash: entity.contentHash,
    createdAt: entity.createdAt,
    documentUrl: entity.documentUrl,
    id: entity.id,
    isCurrent: entity.isCurrent,
    issuingInstitutionId: entity.issuingInstitutionId,
    jurisdictionId: entity.jurisdictionId,
    kindId: entity.kindId,
    status: entity.status,
    summary: entity.summary,
    title: entity.title,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as LegalInstrumentPublicDto;
  }

  async execute(input: { instrumentId: string }): Promise<LegalInstrumentResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.instrumentId } as never);
    if (!entity) throw new NotFoundException('LegalInstrument not found');
    return {
      instrument: this.toReadModel(entity),
    } as unknown as LegalInstrumentResponseDto;
  }
}