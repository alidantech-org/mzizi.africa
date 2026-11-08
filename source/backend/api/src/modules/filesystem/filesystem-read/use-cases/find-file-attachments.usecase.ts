import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { FileAttachmentListQueryDto } from '#/modules/filesystem/dto/file-attachment-list-query.dto';
import type { FileAttachmentPublicDto } from '#/modules/filesystem/dto/file-attachment-public.dto';
import type { FileAttachmentDto } from '#/modules/filesystem/dto/file-attachment.dto';
import type { FileAttachmentsListResponseDto } from '#/modules/filesystem/dto/file-attachments-list-response.dto';
import type { FileDto } from '#/modules/filesystem/dto/file.dto';
import type { FolderDto } from '#/modules/filesystem/dto/folder.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { FileAttachmentEntity } from '#/modules/filesystem/entities/file-attachment.entity';
import { listPage } from '#/read/list-page';
import { OF_PUBLIC_FILE } from '#/read/public';

/**
 * List attachments of public files.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of FileAttachmentEntity); review it and add business rules here.
 */
@Injectable()
export class FindFileAttachmentsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(FileAttachmentEntity);
  }

  private toReadModel(entity: FileAttachmentEntity): FileAttachmentPublicDto {
    return {
    createdAt: entity.createdAt,
    fileId: entity.fileId,
    id: entity.id,
    position: entity.position,
    role: entity.role,
    targetId: entity.targetId,
    targetKind: entity.targetKind,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as FileAttachmentPublicDto;
  }

  async execute(input: FileAttachmentListQueryDto): Promise<FileAttachmentsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input, OF_PUBLIC_FILE);
    return { attachments: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as FileAttachmentsListResponseDto;
  }
}
