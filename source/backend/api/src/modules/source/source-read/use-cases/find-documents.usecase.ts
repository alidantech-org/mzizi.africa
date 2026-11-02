import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { DocumentListQueryDto } from '#/modules/source/dto/document-list-query.dto';
import type { DocumentPublicDto } from '#/modules/source/dto/document-public.dto';
import type { DocumentDto } from '#/modules/source/dto/document.dto';
import type { DocumentsListResponseDto } from '#/modules/source/dto/documents-list-response.dto';
import type { PublisherDto } from '#/modules/source/dto/publisher.dto';
import { DocumentEntity } from '#/modules/source/entities/document.entity';
import { listPage } from '#/read/list-page';

/**
 * List source documents.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of DocumentEntity); review it and add business rules here.
 */
@Injectable()
export class FindDocumentsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(DocumentEntity);
  }

  private toReadModel(entity: DocumentEntity): DocumentPublicDto {
    return {
    citation: entity.citation,
    createdAt: entity.createdAt,
    id: entity.id,
    jurisdictionId: entity.jurisdictionId,
    kindId: entity.kindId,
    language: entity.language,
    licence: entity.licence,
    publishedOn: entity.publishedOn,
    publishedOnPrecision: entity.publishedOnPrecision,
    publisherId: entity.publisherId,
    title: entity.title,
    updatedAt: entity.updatedAt,
    url: entity.url,
    version: entity.version,
    } as unknown as DocumentPublicDto;
  }

  async execute(input: DocumentListQueryDto): Promise<DocumentsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { documents: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as DocumentsListResponseDto;
  }
}
