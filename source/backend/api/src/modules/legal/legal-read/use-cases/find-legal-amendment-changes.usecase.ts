import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { LegalAmendmentChangeListQueryDto } from '#/modules/legal/dto/legal-amendment-change-list-query.dto';
import type { LegalAmendmentChangePublicDto } from '#/modules/legal/dto/legal-amendment-change-public.dto';
import type { LegalAmendmentChangeDto } from '#/modules/legal/dto/legal-amendment-change.dto';
import type { LegalAmendmentChangesListResponseDto } from '#/modules/legal/dto/legal-amendment-changes-list-response.dto';
import type { LegalAmendmentDto } from '#/modules/legal/dto/legal-amendment.dto';
import type { LegalInstrumentDto } from '#/modules/legal/dto/legal-instrument.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { LegalAmendmentChangeEntity } from '#/modules/legal/entities/legal-amendment-change.entity';
import { listPage } from '#/read/list-page';

/**
 * List legal amendment changes.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of LegalAmendmentChangeEntity); review it and add business rules here.
 */
@Injectable()
export class FindLegalAmendmentChangesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(LegalAmendmentChangeEntity);
  }

  private toReadModel(entity: LegalAmendmentChangeEntity): LegalAmendmentChangePublicDto {
    return {
    amendmentId: entity.amendmentId,
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    kind: entity.kind,
    licence: entity.licence,
    method: entity.method,
    newText: entity.newText,
    previousText: entity.previousText,
    provisionId: entity.provisionId,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as LegalAmendmentChangePublicDto;
  }

  async execute(input: LegalAmendmentChangeListQueryDto): Promise<LegalAmendmentChangesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { changes: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as LegalAmendmentChangesListResponseDto;
  }
}
