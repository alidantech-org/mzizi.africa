import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { EvidenceReferenceListQueryDto } from '#/modules/audit/dto/evidence-reference-list-query.dto';
import type { EvidenceReferencePublicDto } from '#/modules/audit/dto/evidence-reference-public.dto';
import type { EvidenceReferenceDto } from '#/modules/audit/dto/evidence-reference.dto';
import type { EvidenceReferencesListResponseDto } from '#/modules/audit/dto/evidence-references-list-response.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { EvidenceReferenceEntity } from '#/modules/audit/entities/evidence-reference.entity';
import { listPage } from '#/read/list-page';

/**
 * List evidence references.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of EvidenceReferenceEntity); review it and add business rules here.
 */
@Injectable()
export class FindEvidenceReferencesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(EvidenceReferenceEntity);
  }

  private toReadModel(entity: EvidenceReferenceEntity): EvidenceReferencePublicDto {
    return {
    actorId: entity.actorId,
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    createdAt: entity.createdAt,
    id: entity.id,
    mediaType: entity.mediaType,
    note: entity.note,
    sizeBytes: entity.sizeBytes,
    targetId: entity.targetId,
    targetKind: entity.targetKind,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as EvidenceReferencePublicDto;
  }

  async execute(input: EvidenceReferenceListQueryDto): Promise<EvidenceReferencesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { evidenceReferences: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as EvidenceReferencesListResponseDto;
  }
}
