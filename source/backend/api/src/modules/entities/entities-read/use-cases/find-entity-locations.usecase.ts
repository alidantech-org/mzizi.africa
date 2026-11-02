import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { EntityLocationListQueryDto } from '#/modules/entities/dto/entity-location-list-query.dto';
import type { EntityLocationPublicDto } from '#/modules/entities/dto/entity-location-public.dto';
import type { EntityLocationDto } from '#/modules/entities/dto/entity-location.dto';
import type { EntityLocationsListResponseDto } from '#/modules/entities/dto/entity-locations-list-response.dto';
import type { LegalEntityDto } from '#/modules/entities/dto/legal-entity.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { EntityLocationEntity } from '#/modules/entities/entities/entity-location.entity';

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
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    entityId: entity.entityId,
    geoUnitId: entity.geoUnitId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    kindId: entity.kindId,
    licence: entity.licence,
    method: entity.method,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as EntityLocationPublicDto;
  }

  async execute(input: EntityLocationListQueryDto): Promise<EntityLocationsListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.entityId !== undefined) where.entityId = input.entityId;
    if (input.geoUnitId !== undefined) where.geoUnitId = input.geoUnitId;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<EntityLocationEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      locations: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as EntityLocationsListResponseDto;
  }
}