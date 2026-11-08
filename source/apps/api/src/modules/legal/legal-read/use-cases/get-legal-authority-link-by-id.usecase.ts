import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { LegalAuthorityLinkPublicDto } from '#/modules/legal/dto/legal-authority-link-public.dto';
import type { LegalAuthorityLinkResponseDto } from '#/modules/legal/dto/legal-authority-link-response.dto';
import type { LegalAuthorityLinkDto } from '#/modules/legal/dto/legal-authority-link.dto';
import type { LegalInstrumentDto } from '#/modules/legal/dto/legal-instrument.dto';
import type { LegalProvisionDto } from '#/modules/legal/dto/legal-provision.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { LegalAuthorityLinkEntity } from '#/modules/legal/entities/legal-authority-link.entity';

/**
 * Get legal authority links by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of LegalAuthorityLinkEntity); review it and add business rules here.
 */
@Injectable()
export class GetLegalAuthorityLinkByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(LegalAuthorityLinkEntity);
  }

  private toReadModel(entity: LegalAuthorityLinkEntity): LegalAuthorityLinkPublicDto {
    return {
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    note: entity.note,
    provisionId: entity.provisionId,
    targetId: entity.targetId,
    targetKind: entity.targetKind,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as LegalAuthorityLinkPublicDto;
  }

  async execute(input: { linkId: string }): Promise<LegalAuthorityLinkResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.linkId } as never);
    if (!entity) throw new NotFoundException('LegalAuthorityLink not found');
    return {
      link: this.toReadModel(entity),
    } as unknown as LegalAuthorityLinkResponseDto;
  }
}