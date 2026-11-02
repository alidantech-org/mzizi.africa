import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { SitePublisherPublicDto } from '#/modules/website/dto/site-publisher-public.dto';
import type { SitePublisherResponseDto } from '#/modules/website/dto/site-publisher-response.dto';
import type { SitePublisherDto } from '#/modules/website/dto/site-publisher.dto';
import type { SiteDto } from '#/modules/website/dto/site.dto';
import { SitePublisherEntity } from '#/modules/website/entities/site-publisher.entity';

/**
 * Get site and publisher links by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of SitePublisherEntity); review it and add business rules here.
 */
@Injectable()
export class GetSitePublisherByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SitePublisherEntity);
  }

  private toReadModel(entity: SitePublisherEntity): SitePublisherPublicDto {
    return {
    createdAt: entity.createdAt,
    id: entity.id,
    publisherId: entity.publisherId,
    role: entity.role,
    siteId: entity.siteId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validTo: entity.validTo,
    version: entity.version,
    } as unknown as SitePublisherPublicDto;
  }

  async execute(input: { sitePublisherId: string }): Promise<SitePublisherResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.sitePublisherId } as never);
    if (!entity) throw new NotFoundException('SitePublisher not found');
    return {
      sitePublisher: this.toReadModel(entity),
    } as unknown as SitePublisherResponseDto;
  }
}