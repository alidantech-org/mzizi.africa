import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { StructurePublicDto } from '#/modules/website/dto/structure-public.dto';
import type { StructureResponseDto } from '#/modules/website/dto/structure-response.dto';
import type { StructureDto } from '#/modules/website/dto/structure.dto';
import { StructureEntity } from '#/modules/website/entities/structure.entity';

/**
 * Get site structures by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of StructureEntity); review it and add business rules here.
 */
@Injectable()
export class GetStructureByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(StructureEntity);
  }

  private toReadModel(entity: StructureEntity): StructurePublicDto {
    return {
    createdAt: entity.createdAt,
    currentVersionId: entity.currentVersionId,
    id: entity.id,
    ownerId: entity.ownerId,
    ownerKind: entity.ownerKind,
    purpose: entity.purpose,
    status: entity.status,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as StructurePublicDto;
  }

  async execute(input: { structureId: string }): Promise<StructureResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.structureId } as never);
    if (!entity) throw new NotFoundException('Structure not found');
    return {
      structure: this.toReadModel(entity),
    } as unknown as StructureResponseDto;
  }
}