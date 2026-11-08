import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { SiteTraitPublicDto } from '#/modules/website/dto/site-trait-public.dto';
import type { SiteTraitResponseDto } from '#/modules/website/dto/site-trait-response.dto';
import type { SiteTraitDto } from '#/modules/website/dto/site-trait.dto';
import { SiteTraitEntity } from '#/modules/website/entities/site-trait.entity';

/**
 * Get site and family traits by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of SiteTraitEntity); review it and add business rules here.
 */
@Injectable()
export class GetSiteTraitByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SiteTraitEntity);
  }

  private toReadModel(entity: SiteTraitEntity): SiteTraitPublicDto {
    return {
    createdAt: entity.createdAt,
    id: entity.id,
    methodId: entity.methodId,
    observedAt: entity.observedAt,
    ownerId: entity.ownerId,
    ownerKind: entity.ownerKind,
    score: entity.score,
    tag: entity.tag,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as SiteTraitPublicDto;
  }

  async execute(input: { siteTraitId: string }): Promise<SiteTraitResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.siteTraitId } as never);
    if (!entity) throw new NotFoundException('SiteTrait not found');
    return {
      siteTrait: this.toReadModel(entity),
    } as unknown as SiteTraitResponseDto;
  }
}