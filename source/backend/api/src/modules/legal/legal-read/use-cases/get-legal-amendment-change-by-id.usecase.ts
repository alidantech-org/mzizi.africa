import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { LegalAmendmentChangePublicDto } from '#/modules/legal/dto/legal-amendment-change-public.dto';
import type { LegalAmendmentChangeResponseDto } from '#/modules/legal/dto/legal-amendment-change-response.dto';
import type { LegalAmendmentChangeDto } from '#/modules/legal/dto/legal-amendment-change.dto';
import type { LegalAmendmentDto } from '#/modules/legal/dto/legal-amendment.dto';
import type { LegalInstrumentDto } from '#/modules/legal/dto/legal-instrument.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { LegalAmendmentChangeEntity } from '#/modules/legal/entities/legal-amendment-change.entity';

/**
 * Get legal amendment changes by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of LegalAmendmentChangeEntity); review it and add business rules here.
 */
@Injectable()
export class GetLegalAmendmentChangeByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(LegalAmendmentChangeEntity);
  }

  private toReadModel(entity: LegalAmendmentChangeEntity): LegalAmendmentChangePublicDto {
    return {
    amendmentId: entity.amendmentId,
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    kind: entity.kind,
    newText: entity.newText,
    previousText: entity.previousText,
    provisionId: entity.provisionId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as LegalAmendmentChangePublicDto;
  }

  async execute(input: { changeId: string }): Promise<LegalAmendmentChangeResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.changeId } as never);
    if (!entity) throw new NotFoundException('LegalAmendmentChange not found');
    return {
      change: this.toReadModel(entity),
    } as unknown as LegalAmendmentChangeResponseDto;
  }
}