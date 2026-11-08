import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { PublisherPublicDto } from '#/modules/source/dto/publisher-public.dto';
import type { PublisherResponseDto } from '#/modules/source/dto/publisher-response.dto';
import type { PublisherDto } from '#/modules/source/dto/publisher.dto';
import { PublisherEntity } from '#/modules/source/entities/publisher.entity';

/**
 * Get publishers by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of PublisherEntity); review it and add business rules here.
 */
@Injectable()
export class GetPublisherByIdUseCase {
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

  async execute(input: { publisherId: string }): Promise<PublisherResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.publisherId } as never);
    if (!entity) throw new NotFoundException('Publisher not found');
    return {
      publisher: this.toReadModel(entity),
    } as unknown as PublisherResponseDto;
  }
}