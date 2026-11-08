import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { SiteCheckPublicDto } from '#/modules/website/dto/site-check-public.dto';
import type { SiteCheckResponseDto } from '#/modules/website/dto/site-check-response.dto';
import type { SiteCheckDto } from '#/modules/website/dto/site-check.dto';
import type { SiteDto } from '#/modules/website/dto/site.dto';
import { SiteCheckEntity } from '#/modules/website/entities/site-check.entity';

/**
 * Get site checks by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of SiteCheckEntity); review it and add business rules here.
 */
@Injectable()
export class GetSiteCheckByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SiteCheckEntity);
  }

  private toReadModel(entity: SiteCheckEntity): SiteCheckPublicDto {
    return {
    checkedAt: entity.checkedAt,
    createdAt: entity.createdAt,
    detail: entity.detail,
    id: entity.id,
    kind: entity.kind,
    outcome: entity.outcome,
    siteId: entity.siteId,
    structureVersionId: entity.structureVersionId,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as SiteCheckPublicDto;
  }

  async execute(input: { siteCheckId: string }): Promise<SiteCheckResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.siteCheckId } as never);
    if (!entity) throw new NotFoundException('SiteCheck not found');
    return {
      siteCheck: this.toReadModel(entity),
    } as unknown as SiteCheckResponseDto;
  }
}