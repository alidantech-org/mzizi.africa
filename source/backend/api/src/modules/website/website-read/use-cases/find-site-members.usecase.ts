import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { SiteMemberListQueryDto } from '#/modules/website/dto/site-member-list-query.dto';
import type { SiteMemberPublicDto } from '#/modules/website/dto/site-member-public.dto';
import type { SiteMemberDto } from '#/modules/website/dto/site-member.dto';
import type { SiteMembersListResponseDto } from '#/modules/website/dto/site-members-list-response.dto';
import type { SiteDto } from '#/modules/website/dto/site.dto';
import { SiteMemberEntity } from '#/modules/website/entities/site-member.entity';
import { listPage } from '#/read/list-page';

/**
 * List family memberships.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of SiteMemberEntity); review it and add business rules here.
 */
@Injectable()
export class FindSiteMembersUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SiteMemberEntity);
  }

  private toReadModel(entity: SiteMemberEntity): SiteMemberPublicDto {
    return {
    basis: entity.basis,
    createdAt: entity.createdAt,
    familyId: entity.familyId,
    id: entity.id,
    methodId: entity.methodId,
    role: entity.role,
    score: entity.score,
    siteId: entity.siteId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validTo: entity.validTo,
    version: entity.version,
    } as unknown as SiteMemberPublicDto;
  }

  async execute(input: SiteMemberListQueryDto): Promise<SiteMembersListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { siteMembers: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as SiteMembersListResponseDto;
  }
}
