import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { SiteRelationPublicDto } from '#/modules/website/dto/site-relation-public.dto';
import type { SiteRelationResponseDto } from '#/modules/website/dto/site-relation-response.dto';
import type { SiteRelationDto } from '#/modules/website/dto/site-relation.dto';
import { SiteRelationEntity } from '#/modules/website/entities/site-relation.entity';

/**
 * Get site and family relations by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of SiteRelationEntity); review it and add business rules here.
 */
@Injectable()
export class GetSiteRelationByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SiteRelationEntity);
  }

  private toReadModel(entity: SiteRelationEntity): SiteRelationPublicDto {
    return {
    basis: entity.basis,
    createdAt: entity.createdAt,
    evidence: entity.evidence,
    fromId: entity.fromId,
    fromKind: entity.fromKind,
    id: entity.id,
    relation: entity.relation,
    score: entity.score,
    toId: entity.toId,
    toKind: entity.toKind,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as SiteRelationPublicDto;
  }

  async execute(input: { siteRelationId: string }): Promise<SiteRelationResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.siteRelationId } as never);
    if (!entity) throw new NotFoundException('SiteRelation not found');
    return {
      siteRelation: this.toReadModel(entity),
    } as unknown as SiteRelationResponseDto;
  }
}