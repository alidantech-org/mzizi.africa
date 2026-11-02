import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { LegalInstrumentListQueryDto } from '#/modules/legal/dto/legal-instrument-list-query.dto';
import type { LegalInstrumentPublicDto } from '#/modules/legal/dto/legal-instrument-public.dto';
import type { LegalInstrumentDto } from '#/modules/legal/dto/legal-instrument.dto';
import type { LegalInstrumentsListResponseDto } from '#/modules/legal/dto/legal-instruments-list-response.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { LegalInstrumentEntity } from '#/modules/legal/entities/legal-instrument.entity';
import { listPage } from '#/read/list-page';

/**
 * List legal instruments.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of LegalInstrumentEntity); review it and add business rules here.
 */
@Injectable()
export class FindLegalInstrumentsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(LegalInstrumentEntity);
  }

  private toReadModel(entity: LegalInstrumentEntity): LegalInstrumentPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    code: entity.code,
    confidence: entity.confidence,
    contentHash: entity.contentHash,
    createdAt: entity.createdAt,
    documentUrl: entity.documentUrl,
    id: entity.id,
    isCurrent: entity.isCurrent,
    issuingInstitutionId: entity.issuingInstitutionId,
    jurisdictionId: entity.jurisdictionId,
    kindId: entity.kindId,
    licence: entity.licence,
    method: entity.method,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    status: entity.status,
    summary: entity.summary,
    title: entity.title,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as LegalInstrumentPublicDto;
  }

  async execute(input: LegalInstrumentListQueryDto): Promise<LegalInstrumentsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { instruments: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as LegalInstrumentsListResponseDto;
  }
}
