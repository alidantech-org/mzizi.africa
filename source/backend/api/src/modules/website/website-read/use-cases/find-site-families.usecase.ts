import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { SiteFamiliesListResponseDto } from '#/modules/website/dto/site-families-list-response.dto';
import type { SiteFamilyListQueryDto } from '#/modules/website/dto/site-family-list-query.dto';
import type { SiteFamilyPublicDto } from '#/modules/website/dto/site-family-public.dto';
import type { SiteFamilyDto } from '#/modules/website/dto/site-family.dto';
import { SiteFamilyEntity } from '#/modules/website/entities/site-family.entity';
import { listPage } from '#/read/list-page';

/**
 * List site families.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of SiteFamilyEntity); review it and add business rules here.
 */
@Injectable()
export class FindSiteFamiliesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SiteFamilyEntity);
  }

  private toReadModel(entity: SiteFamilyEntity): SiteFamilyPublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    description: entity.description,
    id: entity.id,
    jurisdictionId: entity.jurisdictionId,
    kind: entity.kind,
    name: entity.name,
    status: entity.status,
    subjectKindId: entity.subjectKindId,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as SiteFamilyPublicDto;
  }

  async execute(input: SiteFamilyListQueryDto): Promise<SiteFamiliesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { families: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as SiteFamiliesListResponseDto;
  }
}
