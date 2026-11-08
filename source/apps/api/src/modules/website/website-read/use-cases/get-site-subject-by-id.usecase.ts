import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { SiteSubjectPublicDto } from '#/modules/website/dto/site-subject-public.dto';
import type { SiteSubjectResponseDto } from '#/modules/website/dto/site-subject-response.dto';
import type { SiteSubjectDto } from '#/modules/website/dto/site-subject.dto';
import type { SiteDto } from '#/modules/website/dto/site.dto';
import { SiteSubjectEntity } from '#/modules/website/entities/site-subject.entity';

/**
 * Get site subjects by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of SiteSubjectEntity); review it and add business rules here.
 */
@Injectable()
export class GetSiteSubjectByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SiteSubjectEntity);
  }

  private toReadModel(entity: SiteSubjectEntity): SiteSubjectPublicDto {
    return {
    createdAt: entity.createdAt,
    id: entity.id,
    relation: entity.relation,
    siteId: entity.siteId,
    targetId: entity.targetId,
    targetKind: entity.targetKind,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validTo: entity.validTo,
    version: entity.version,
    } as unknown as SiteSubjectPublicDto;
  }

  async execute(input: { siteSubjectId: string }): Promise<SiteSubjectResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.siteSubjectId } as never);
    if (!entity) throw new NotFoundException('SiteSubject not found');
    return {
      siteSubject: this.toReadModel(entity),
    } as unknown as SiteSubjectResponseDto;
  }
}