import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { DomainPatternListQueryDto } from '#/modules/website/dto/domain-pattern-list-query.dto';
import type { DomainPatternPublicDto } from '#/modules/website/dto/domain-pattern-public.dto';
import type { DomainPatternDto } from '#/modules/website/dto/domain-pattern.dto';
import type { DomainPatternsListResponseDto } from '#/modules/website/dto/domain-patterns-list-response.dto';
import type { SiteFamilyDto } from '#/modules/website/dto/site-family.dto';
import { DomainPatternEntity } from '#/modules/website/entities/domain-pattern.entity';
import { listPage } from '#/read/list-page';

/**
 * List domain patterns.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of DomainPatternEntity); review it and add business rules here.
 */
@Injectable()
export class FindDomainPatternsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(DomainPatternEntity);
  }

  private toReadModel(entity: DomainPatternEntity): DomainPatternPublicDto {
    return {
    createdAt: entity.createdAt,
    domainRole: entity.domainRole,
    familyId: entity.familyId,
    id: entity.id,
    notes: entity.notes,
    scheme: entity.scheme,
    status: entity.status,
    template: entity.template,
    updatedAt: entity.updatedAt,
    variables: entity.variables,
    version: entity.version,
    } as unknown as DomainPatternPublicDto;
  }

  async execute(input: DomainPatternListQueryDto): Promise<DomainPatternsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { domainPatterns: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as DomainPatternsListResponseDto;
  }
}
