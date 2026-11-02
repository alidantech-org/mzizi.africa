import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { LegalAuthorityLinkListQueryDto } from '#/modules/legal/dto/legal-authority-link-list-query.dto';
import type { LegalAuthorityLinkPublicDto } from '#/modules/legal/dto/legal-authority-link-public.dto';
import type { LegalAuthorityLinkDto } from '#/modules/legal/dto/legal-authority-link.dto';
import type { LegalAuthorityLinksListResponseDto } from '#/modules/legal/dto/legal-authority-links-list-response.dto';
import type { LegalInstrumentDto } from '#/modules/legal/dto/legal-instrument.dto';
import type { LegalProvisionDto } from '#/modules/legal/dto/legal-provision.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { LegalAuthorityLinkEntity } from '#/modules/legal/entities/legal-authority-link.entity';

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
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    licence: entity.licence,
    method: entity.method,
    note: entity.note,
    provisionId: entity.provisionId,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    targetId: entity.targetId,
    targetKind: entity.targetKind,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as LegalAuthorityLinkPublicDto;
  }

  async execute(input: LegalAuthorityLinkListQueryDto): Promise<LegalAuthorityLinksListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.provisionId !== undefined) where.provisionId = input.provisionId;
    if (input.targetId !== undefined) where.targetId = input.targetId;
    if (input.targetKind !== undefined) where.targetKind = input.targetKind;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<LegalAuthorityLinkEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      links: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as LegalAuthorityLinksListResponseDto;
  }
}