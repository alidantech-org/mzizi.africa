import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { StructureVersionPublicDto } from '#/modules/website/dto/structure-version-public.dto';
import type { StructureVersionResponseDto } from '#/modules/website/dto/structure-version-response.dto';
import type { StructureVersionDto } from '#/modules/website/dto/structure-version.dto';
import type { StructureDto } from '#/modules/website/dto/structure.dto';
import { StructureVersionEntity } from '#/modules/website/entities/structure-version.entity';

/**
 * Get structure versions by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of StructureVersionEntity); review it and add business rules here.
 */
@Injectable()
export class GetStructureVersionByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(StructureVersionEntity);
  }

  private toReadModel(entity: StructureVersionEntity): StructureVersionPublicDto {
    return {
    createdAt: entity.createdAt,
    createdBy: entity.createdBy,
    folderId: entity.folderId,
    id: entity.id,
    manifestHash: entity.manifestHash,
    methodId: entity.methodId,
    notesSummary: entity.notesSummary,
    number: entity.number,
    schemaVersion: entity.schemaVersion,
    status: entity.status,
    structureId: entity.structureId,
    supersedesId: entity.supersedesId,
    updatedAt: entity.updatedAt,
    validationReport: entity.validationReport,
    version: entity.version,
    } as unknown as StructureVersionPublicDto;
  }

  async execute(input: { structureVersionId: string }): Promise<StructureVersionResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.structureVersionId } as never);
    if (!entity) throw new NotFoundException('StructureVersion not found');
    return {
      structureVersion: this.toReadModel(entity),
    } as unknown as StructureVersionResponseDto;
  }
}