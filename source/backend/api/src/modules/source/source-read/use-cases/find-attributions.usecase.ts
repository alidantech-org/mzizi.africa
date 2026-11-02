import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { AttributionListQueryDto } from '#/modules/source/dto/attribution-list-query.dto';
import type { AttributionPublicDto } from '#/modules/source/dto/attribution-public.dto';
import type { AttributionDto } from '#/modules/source/dto/attribution.dto';
import type { AttributionsListResponseDto } from '#/modules/source/dto/attributions-list-response.dto';
import type { DocumentDto } from '#/modules/source/dto/document.dto';
import type { PublisherDto } from '#/modules/source/dto/publisher.dto';
import { AttributionEntity } from '#/modules/source/entities/attribution.entity';
import { listPage } from '#/read/list-page';

/**
 * List attributions.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of AttributionEntity); review it and add business rules here.
 */
@Injectable()
export class FindAttributionsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(AttributionEntity);
  }

  private toReadModel(entity: AttributionEntity): AttributionPublicDto {
    return {
    attributedBy: entity.attributedBy,
    captureId: entity.captureId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    documentId: entity.documentId,
    id: entity.id,
    locator: entity.locator,
    methodId: entity.methodId,
    relation: entity.relation,
    targetField: entity.targetField,
    targetId: entity.targetId,
    targetKind: entity.targetKind,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as AttributionPublicDto;
  }

  async execute(input: AttributionListQueryDto): Promise<AttributionsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { attributions: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as AttributionsListResponseDto;
  }
}
