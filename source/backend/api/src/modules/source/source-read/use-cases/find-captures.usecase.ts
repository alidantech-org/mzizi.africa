import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { CaptureListQueryDto } from '#/modules/source/dto/capture-list-query.dto';
import type { CapturePublicDto } from '#/modules/source/dto/capture-public.dto';
import type { CaptureDto } from '#/modules/source/dto/capture.dto';
import type { CapturesListResponseDto } from '#/modules/source/dto/captures-list-response.dto';
import type { DocumentDto } from '#/modules/source/dto/document.dto';
import type { PublisherDto } from '#/modules/source/dto/publisher.dto';
import { CaptureEntity } from '#/modules/source/entities/capture.entity';
import { listPage } from '#/read/list-page';

/**
 * List captures of source documents.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of CaptureEntity); review it and add business rules here.
 */
@Injectable()
export class FindCapturesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(CaptureEntity);
  }

  private toReadModel(entity: CaptureEntity): CapturePublicDto {
    return {
    contentHash: entity.contentHash,
    createdAt: entity.createdAt,
    documentId: entity.documentId,
    fileVersionId: entity.fileVersionId,
    httpStatus: entity.httpStatus,
    id: entity.id,
    retrievedAt: entity.retrievedAt,
    retrievedBy: entity.retrievedBy,
    retrievedUrl: entity.retrievedUrl,
    tool: entity.tool,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as CapturePublicDto;
  }

  async execute(input: CaptureListQueryDto): Promise<CapturesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { captures: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as CapturesListResponseDto;
  }
}
