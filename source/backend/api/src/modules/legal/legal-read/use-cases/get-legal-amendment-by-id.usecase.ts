import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { LegalAmendmentPublicDto } from '#/modules/legal/dto/legal-amendment-public.dto';
import type { LegalAmendmentResponseDto } from '#/modules/legal/dto/legal-amendment-response.dto';
import type { LegalAmendmentDto } from '#/modules/legal/dto/legal-amendment.dto';
import type { LegalInstrumentDto } from '#/modules/legal/dto/legal-instrument.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { LegalAmendmentEntity } from '#/modules/legal/entities/legal-amendment.entity';

/**
 * Get legal amendments by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of LegalAmendmentEntity); review it and add business rules here.
 */
@Injectable()
export class GetLegalAmendmentByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(LegalAmendmentEntity);
  }

  private toReadModel(entity: LegalAmendmentEntity): LegalAmendmentPublicDto {
    return {
    amendingInstrumentId: entity.amendingInstrumentId,
    code: entity.code,
    createdAt: entity.createdAt,
    id: entity.id,
    instrumentId: entity.instrumentId,
    isCurrent: entity.isCurrent,
    summary: entity.summary,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as LegalAmendmentPublicDto;
  }

  async execute(input: { amendmentId: string }): Promise<LegalAmendmentResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.amendmentId } as never);
    if (!entity) throw new NotFoundException('LegalAmendment not found');
    return {
      amendment: this.toReadModel(entity),
    } as unknown as LegalAmendmentResponseDto;
  }
}