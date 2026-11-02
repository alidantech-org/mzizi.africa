import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { FolderPublicDto } from '#/modules/filesystem/dto/folder-public.dto';
import type { FolderResponseDto } from '#/modules/filesystem/dto/folder-response.dto';
import type { FolderDto } from '#/modules/filesystem/dto/folder.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import { FolderEntity } from '#/modules/filesystem/entities/folder.entity';
import { PUBLIC_FOLDER } from '#/read/public';

/**
 * Get public folders by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of FolderEntity); review it and add business rules here.
 */
@Injectable()
export class GetFolderByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(FolderEntity);
  }

  private toReadModel(entity: FolderEntity): FolderPublicDto {
    return {
    createdAt: entity.createdAt,
    depth: entity.depth,
    id: entity.id,
    name: entity.name,
    parentId: entity.parentId,
    path: entity.path,
    updatedAt: entity.updatedAt,
    version: entity.version,
    visibility: entity.visibility,
    } as unknown as FolderPublicDto;
  }

  async execute(input: { folderId: string }): Promise<FolderResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.folderId, ...PUBLIC_FOLDER } as never);
    if (!entity) throw new NotFoundException('Folder not found');
    return {
      folder: this.toReadModel(entity),
    } as unknown as FolderResponseDto;
  }
}