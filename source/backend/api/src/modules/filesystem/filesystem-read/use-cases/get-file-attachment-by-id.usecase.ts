import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { FileAttachmentPublicDto } from '#/modules/filesystem/dto/file-attachment-public.dto';
import type { FileAttachmentResponseDto } from '#/modules/filesystem/dto/file-attachment-response.dto';
import type { FileAttachmentDto } from '#/modules/filesystem/dto/file-attachment.dto';
import type { FileDto } from '#/modules/filesystem/dto/file.dto';
import type { FolderDto } from '#/modules/filesystem/dto/folder.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import { FileAttachmentEntity } from '#/modules/filesystem/entities/file-attachment.entity';
import { OF_PUBLIC_FILE } from '#/read/public';

/**
 * Get attachments of public files by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of FileAttachmentEntity); review it and add business rules here.
 */
@Injectable()
export class GetFileAttachmentByIdUseCase {
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

  async execute(input: { attachmentId: string }): Promise<FileAttachmentResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.attachmentId, ...OF_PUBLIC_FILE } as never);
    if (!entity) throw new NotFoundException('FileAttachment not found');
    return {
      attachment: this.toReadModel(entity),
    } as unknown as FileAttachmentResponseDto;
  }
}