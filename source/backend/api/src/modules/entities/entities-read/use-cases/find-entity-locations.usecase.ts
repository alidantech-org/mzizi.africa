import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { EntityLocationListQueryDto } from '#/modules/entities/dto/entity-location-list-query.dto';
import type { EntityLocationPublicDto } from '#/modules/entities/dto/entity-location-public.dto';
import type { EntityLocationDto } from '#/modules/entities/dto/entity-location.dto';
import type { EntityLocationsListResponseDto } from '#/modules/entities/dto/entity-locations-list-response.dto';
import type { LegalEntityDto } from '#/modules/entities/dto/legal-entity.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { EntityLocationEntity } from '#/modules/entities/entities/entity-location.entity';
import { listPage } from '#/read/list-page';

/**
 * List entity locations.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of EntityLocationEntity); review it and add business rules here.
 */
@Injectable()
export class FindEntityLocationsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(EntityLocationEntity);
  }

  private toReadModel(entity: EntityLocationEntity): EntityLocationPublicDto {
    return {
    addressText: entity.addressText,
    createdAt: entity.createdAt,
    entityId: entity.entityId,
    geoUnitId: entity.geoUnitId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    kindId: entity.kindId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as EntityLocationPublicDto;
  }

  async execute(input: EntityLocationListQueryDto): Promise<EntityLocationsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { locations: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as EntityLocationsListResponseDto;
  }
}
