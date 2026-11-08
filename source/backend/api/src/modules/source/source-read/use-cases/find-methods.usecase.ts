import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { MethodListQueryDto } from '#/modules/source/dto/method-list-query.dto';
import type { MethodPublicDto } from '#/modules/source/dto/method-public.dto';
import type { MethodDto } from '#/modules/source/dto/method.dto';
import type { MethodsListResponseDto } from '#/modules/source/dto/methods-list-response.dto';
import { MethodEntity } from '#/modules/source/entities/method.entity';
import { listPage } from '#/read/list-page';

/**
 * List sourcing methods.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of MethodEntity); review it and add business rules here.
 */
@Injectable()
export class FindMethodsUseCase {
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

  async execute(input: MethodListQueryDto): Promise<MethodsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { methods: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as MethodsListResponseDto;
  }
}
