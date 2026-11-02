import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { LegalAuthorityLinkListQueryDto } from '#/modules/legal/dto/legal-authority-link-list-query.dto';
import type { LegalAuthorityLinkPublicDto } from '#/modules/legal/dto/legal-authority-link-public.dto';
import type { LegalAuthorityLinkDto } from '#/modules/legal/dto/legal-authority-link.dto';
import type { LegalAuthorityLinksListResponseDto } from '#/modules/legal/dto/legal-authority-links-list-response.dto';
import type { LegalInstrumentDto } from '#/modules/legal/dto/legal-instrument.dto';
import type { LegalProvisionDto } from '#/modules/legal/dto/legal-provision.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { LegalAuthorityLinkEntity } from '#/modules/legal/entities/legal-authority-link.entity';
import { listPage } from '#/read/list-page';

/**
 * List legal authority links.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of LegalAuthorityLinkEntity); review it and add business rules here.
 */
@Injectable()
export class FindLegalAuthorityLinksUseCase {
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

  async execute(input: LegalAuthorityLinkListQueryDto): Promise<LegalAuthorityLinksListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { links: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as LegalAuthorityLinksListResponseDto;
  }
}
