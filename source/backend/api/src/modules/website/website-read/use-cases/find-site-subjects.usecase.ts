import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { SiteSubjectListQueryDto } from '#/modules/website/dto/site-subject-list-query.dto';
import type { SiteSubjectPublicDto } from '#/modules/website/dto/site-subject-public.dto';
import type { SiteSubjectDto } from '#/modules/website/dto/site-subject.dto';
import type { SiteSubjectsListResponseDto } from '#/modules/website/dto/site-subjects-list-response.dto';
import type { SiteDto } from '#/modules/website/dto/site.dto';
import { SiteSubjectEntity } from '#/modules/website/entities/site-subject.entity';
import { listPage } from '#/read/list-page';

/**
 * List site subjects.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of SiteSubjectEntity); review it and add business rules here.
 */
@Injectable()
export class FindSiteSubjectsUseCase {
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

  async execute(input: SiteSubjectListQueryDto): Promise<SiteSubjectsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { siteSubjects: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as SiteSubjectsListResponseDto;
  }
}
