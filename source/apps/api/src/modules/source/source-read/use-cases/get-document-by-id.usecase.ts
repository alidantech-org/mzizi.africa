import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { DocumentPublicDto } from '#/modules/source/dto/document-public.dto';
import type { DocumentResponseDto } from '#/modules/source/dto/document-response.dto';
import type { DocumentDto } from '#/modules/source/dto/document.dto';
import type { PublisherDto } from '#/modules/source/dto/publisher.dto';
import { DocumentEntity } from '#/modules/source/entities/document.entity';

/**
 * Get source documents by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of DocumentEntity); review it and add business rules here.
 */
@Injectable()
export class GetDocumentByIdUseCase {
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

  async execute(input: { documentId: string }): Promise<DocumentResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.documentId } as never);
    if (!entity) throw new NotFoundException('Document not found');
    return {
      document: this.toReadModel(entity),
    } as unknown as DocumentResponseDto;
  }
}