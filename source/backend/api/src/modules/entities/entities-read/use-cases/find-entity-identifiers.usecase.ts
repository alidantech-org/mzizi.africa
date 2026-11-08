import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { EntityIdentifierListQueryDto } from '#/modules/entities/dto/entity-identifier-list-query.dto';
import type { EntityIdentifierPublicDto } from '#/modules/entities/dto/entity-identifier-public.dto';
import type { EntityIdentifierDto } from '#/modules/entities/dto/entity-identifier.dto';
import type { EntityIdentifiersListResponseDto } from '#/modules/entities/dto/entity-identifiers-list-response.dto';
import type { LegalEntityDto } from '#/modules/entities/dto/legal-entity.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { EntityIdentifierEntity } from '#/modules/entities/entities/entity-identifier.entity';
import { listPage } from '#/read/list-page';
import { identifierConstraints } from '#/read/restricted-identifiers';

/**
 * List entity identifiers.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of EntityIdentifierEntity); review it and add business rules here.
 */
@Injectable()
export class FindEntityIdentifiersUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(EntityIdentifierEntity);
  }

  private toReadModel(entity: EntityIdentifierEntity): EntityIdentifierPublicDto {
    return {
    createdAt: entity.createdAt,
    entityId: entity.entityId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    issuingAuthorityId: entity.issuingAuthorityId,
    schemeId: entity.schemeId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    value: entity.value,
    version: entity.version,
    } as unknown as EntityIdentifierPublicDto;
  }

  async execute(input: EntityIdentifierListQueryDto): Promise<EntityIdentifiersListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input, await identifierConstraints(this.dataSource));
    return { identifiers: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as EntityIdentifiersListResponseDto;
  }
}
