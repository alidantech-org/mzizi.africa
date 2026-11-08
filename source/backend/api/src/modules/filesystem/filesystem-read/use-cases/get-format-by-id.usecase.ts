import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { FormatPublicDto } from '#/modules/filesystem/dto/format-public.dto';
import type { FormatResponseDto } from '#/modules/filesystem/dto/format-response.dto';
import type { FormatDto } from '#/modules/filesystem/dto/format.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import { FormatEntity } from '#/modules/filesystem/entities/format.entity';

/**
 * Get media formats by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of FormatEntity); review it and add business rules here.
 */
@Injectable()
export class GetFormatByIdUseCase {
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

  async execute(input: { formatId: string }): Promise<FormatResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.formatId } as never);
    if (!entity) throw new NotFoundException('Format not found');
    return {
      format: this.toReadModel(entity),
    } as unknown as FormatResponseDto;
  }
}