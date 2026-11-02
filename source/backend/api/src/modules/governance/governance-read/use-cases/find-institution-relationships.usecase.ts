import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { InstitutionRelationshipListQueryDto } from '#/modules/governance/dto/institution-relationship-list-query.dto';
import type { InstitutionRelationshipPublicDto } from '#/modules/governance/dto/institution-relationship-public.dto';
import type { InstitutionRelationshipDto } from '#/modules/governance/dto/institution-relationship.dto';
import type { InstitutionRelationshipsListResponseDto } from '#/modules/governance/dto/institution-relationships-list-response.dto';
import type { InstitutionDto } from '#/modules/governance/dto/institution.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { InstitutionRelationshipEntity } from '#/modules/governance/entities/institution-relationship.entity';
import { listPage } from '#/read/list-page';

/**
 * List institution relationships.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of InstitutionRelationshipEntity); review it and add business rules here.
 */
@Injectable()
export class FindInstitutionRelationshipsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(InstitutionRelationshipEntity);
  }

  private toReadModel(entity: InstitutionRelationshipEntity): InstitutionRelationshipPublicDto {
    return {
    childInstitutionId: entity.childInstitutionId,
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    kind: entity.kind,
    legalBasisId: entity.legalBasisId,
    parentInstitutionId: entity.parentInstitutionId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as InstitutionRelationshipPublicDto;
  }

  async execute(input: InstitutionRelationshipListQueryDto): Promise<InstitutionRelationshipsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { relationships: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as InstitutionRelationshipsListResponseDto;
  }
}
