import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { FormatListQueryDto } from '#/modules/filesystem/dto/format-list-query.dto';
import type { FormatPublicDto } from '#/modules/filesystem/dto/format-public.dto';
import type { FormatDto } from '#/modules/filesystem/dto/format.dto';
import type { FormatsListResponseDto } from '#/modules/filesystem/dto/formats-list-response.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { FormatEntity } from '#/modules/filesystem/entities/format.entity';
import { listPage } from '#/read/list-page';

/**
 * List media formats.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of FormatEntity); review it and add business rules here.
 */
@Injectable()
export class FindFormatsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(FormatEntity);
  }

  private toReadModel(entity: FormatEntity): FormatPublicDto {
    return {
    category: entity.category,
    code: entity.code,
    createdAt: entity.createdAt,
    extension: entity.extension,
    id: entity.id,
    isPreviewable: entity.isPreviewable,
    maxSizeBytes: entity.maxSizeBytes,
    mimeType: entity.mimeType,
    name: entity.name,
    processingStrategy: entity.processingStrategy,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as FormatPublicDto;
  }

  async execute(input: FormatListQueryDto): Promise<FormatsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { formats: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as FormatsListResponseDto;
  }
}
