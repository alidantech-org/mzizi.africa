import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { CandidateDto } from '#/modules/elections/dto/candidate.dto';
import type { ElectionDto } from '#/modules/elections/dto/election.dto';
import type { ManifestoListQueryDto } from '#/modules/elections/dto/manifesto-list-query.dto';
import type { ManifestoPublicDto } from '#/modules/elections/dto/manifesto-public.dto';
import type { ManifestoDto } from '#/modules/elections/dto/manifesto.dto';
import type { ManifestosListResponseDto } from '#/modules/elections/dto/manifestos-list-response.dto';
import type { SeatDto } from '#/modules/elections/dto/seat.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { ManifestoEntity } from '#/modules/elections/entities/manifesto.entity';
import { listPage } from '#/read/list-page';

/**
 * List manifestos.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of ManifestoEntity); review it and add business rules here.
 */
@Injectable()
export class FindManifestosUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ManifestoEntity);
  }

  private toReadModel(entity: ManifestoEntity): ManifestoPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    candidateId: entity.candidateId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    documentUrl: entity.documentUrl,
    id: entity.id,
    isCurrent: entity.isCurrent,
    language: entity.language,
    licence: entity.licence,
    method: entity.method,
    publishedOn: entity.publishedOn,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    title: entity.title,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as ManifestoPublicDto;
  }

  async execute(input: ManifestoListQueryDto): Promise<ManifestosListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { manifestos: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as ManifestosListResponseDto;
  }
}
