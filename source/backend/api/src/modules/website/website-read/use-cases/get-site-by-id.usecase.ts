import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { SitePublicDto } from '#/modules/website/dto/site-public.dto';
import type { SiteResponseDto } from '#/modules/website/dto/site-response.dto';
import type { SiteDto } from '#/modules/website/dto/site.dto';
import { SiteEntity } from '#/modules/website/entities/site.entity';

/**
 * Get known sites by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of SiteEntity); review it and add business rules here.
 */
@Injectable()
export class GetSiteByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SiteEntity);
  }

  private toReadModel(entity: SiteEntity): SitePublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    description: entity.description,
    firstSeenAt: entity.firstSeenAt,
    id: entity.id,
    jurisdictionId: entity.jurisdictionId,
    kind: entity.kind,
    lastSeenAt: entity.lastSeenAt,
    name: entity.name,
    status: entity.status,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as SitePublicDto;
  }

  async execute(input: { siteId: string }): Promise<SiteResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.siteId } as never);
    if (!entity) throw new NotFoundException('Site not found');
    return {
      site: this.toReadModel(entity),
    } as unknown as SiteResponseDto;
  }
}