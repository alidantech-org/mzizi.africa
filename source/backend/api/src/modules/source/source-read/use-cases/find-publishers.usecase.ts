import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { PublisherListQueryDto } from '#/modules/source/dto/publisher-list-query.dto';
import type { PublisherPublicDto } from '#/modules/source/dto/publisher-public.dto';
import type { PublisherDto } from '#/modules/source/dto/publisher.dto';
import type { PublishersListResponseDto } from '#/modules/source/dto/publishers-list-response.dto';
import { PublisherEntity } from '#/modules/source/entities/publisher.entity';
import { listPage } from '#/read/list-page';

/**
 * List publishers.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of PublisherEntity); review it and add business rules here.
 */
@Injectable()
export class FindPublishersUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PublisherEntity);
  }

  private toReadModel(entity: PublisherEntity): PublisherPublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    id: entity.id,
    jurisdictionId: entity.jurisdictionId,
    kindId: entity.kindId,
    name: entity.name,
    reliability: entity.reliability,
    updatedAt: entity.updatedAt,
    version: entity.version,
    websiteUrl: entity.websiteUrl,
    } as unknown as PublisherPublicDto;
  }

  async execute(input: PublisherListQueryDto): Promise<PublishersListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { publishers: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as PublishersListResponseDto;
  }
}
