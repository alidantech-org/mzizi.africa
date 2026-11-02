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
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.targetId !== undefined) where.targetId = input.targetId;
    if (input.targetKind !== undefined) where.targetKind = input.targetKind;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<EvidenceReferenceEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      evidenceReferences: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as EvidenceReferencesListResponseDto;
  }
}