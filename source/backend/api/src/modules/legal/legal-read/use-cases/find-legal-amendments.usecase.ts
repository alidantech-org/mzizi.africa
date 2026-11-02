import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { LegalAmendmentListQueryDto } from '#/modules/legal/dto/legal-amendment-list-query.dto';
import type { LegalAmendmentPublicDto } from '#/modules/legal/dto/legal-amendment-public.dto';
import type { LegalAmendmentDto } from '#/modules/legal/dto/legal-amendment.dto';
import type { LegalAmendmentsListResponseDto } from '#/modules/legal/dto/legal-amendments-list-response.dto';
import type { LegalInstrumentDto } from '#/modules/legal/dto/legal-instrument.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { LegalAmendmentEntity } from '#/modules/legal/entities/legal-amendment.entity';
import { listPage } from '#/read/list-page';

/**
 * List legal amendments.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of LegalAmendmentEntity); review it and add business rules here.
 */
@Injectable()
export class FindLegalAmendmentsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(LegalAmendmentEntity);
  }

  private toReadModel(entity: LegalAmendmentEntity): LegalAmendmentPublicDto {
    return {
    amendingInstrumentId: entity.amendingInstrumentId,
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    id: entity.id,
    instrumentId: entity.instrumentId,
    isCurrent: entity.isCurrent,
    licence: entity.licence,
    method: entity.method,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    summary: entity.summary,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as LegalAmendmentPublicDto;
  }

  async execute(input: LegalAmendmentListQueryDto): Promise<LegalAmendmentsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { amendments: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as LegalAmendmentsListResponseDto;
  }
}
