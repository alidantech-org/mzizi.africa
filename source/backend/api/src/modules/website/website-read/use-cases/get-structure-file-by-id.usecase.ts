import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { StructureFilePublicDto } from '#/modules/website/dto/structure-file-public.dto';
import type { StructureFileResponseDto } from '#/modules/website/dto/structure-file-response.dto';
import type { StructureFileDto } from '#/modules/website/dto/structure-file.dto';
import type { StructureVersionDto } from '#/modules/website/dto/structure-version.dto';
import type { StructureDto } from '#/modules/website/dto/structure.dto';
import { StructureFileEntity } from '#/modules/website/entities/structure-file.entity';

/**
 * Get files of structure versions by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of StructureFileEntity); review it and add business rules here.
 */
@Injectable()
export class GetStructureFileByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(StructureFileEntity);
  }

  private toReadModel(entity: StructureFileEntity): StructureFilePublicDto {
    return {
    createdAt: entity.createdAt,
    fileVersionId: entity.fileVersionId,
    id: entity.id,
    path: entity.path,
    role: entity.role,
    updatedAt: entity.updatedAt,
    version: entity.version,
    versionId: entity.versionId,
    } as unknown as StructureFilePublicDto;
  }

  async execute(input: { structureFileId: string }): Promise<StructureFileResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.structureFileId } as never);
    if (!entity) throw new NotFoundException('StructureFile not found');
    return {
      structureFile: this.toReadModel(entity),
    } as unknown as StructureFileResponseDto;
  }
}