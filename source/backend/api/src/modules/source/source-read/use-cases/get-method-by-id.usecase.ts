import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { MethodPublicDto } from '#/modules/source/dto/method-public.dto';
import type { MethodResponseDto } from '#/modules/source/dto/method-response.dto';
import type { MethodDto } from '#/modules/source/dto/method.dto';
import { MethodEntity } from '#/modules/source/entities/method.entity';

/**
 * Get sourcing methods by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of MethodEntity); review it and add business rules here.
 */
@Injectable()
export class GetMethodByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(MethodEntity);
  }

  private toReadModel(entity: MethodEntity): MethodPublicDto {
    return {
    createdAt: entity.createdAt,
    description: entity.description,
    id: entity.id,
    kind: entity.kind,
    model: entity.model,
    name: entity.name,
    tool: entity.tool,
    toolVersion: entity.toolVersion,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as MethodPublicDto;
  }

  async execute(input: { methodId: string }): Promise<MethodResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.methodId } as never);
    if (!entity) throw new NotFoundException('Method not found');
    return {
      method: this.toReadModel(entity),
    } as unknown as MethodResponseDto;
  }
}