import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { AmenitiesListResponseDto } from '#/modules/services/dto/amenities-list-response.dto';
import type { AmenityListQueryDto } from '#/modules/services/dto/amenity-list-query.dto';
import type { AmenityPublicDto } from '#/modules/services/dto/amenity-public.dto';
import type { AmenityDto } from '#/modules/services/dto/amenity.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { AmenityEntity } from '#/modules/services/entities/amenity.entity';
import { listPage } from '#/read/list-page';

/**
 * List amenities.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of AmenityEntity); review it and add business rules here.
 */
@Injectable()
export class FindAmenitiesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(AmenityEntity);
  }

  private toReadModel(entity: AmenityEntity): AmenityPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    geoUnitId: entity.geoUnitId,
    id: entity.id,
    isActive: entity.isActive,
    isCurrent: entity.isCurrent,
    jurisdictionId: entity.jurisdictionId,
    licence: entity.licence,
    method: entity.method,
    name: entity.name,
    retrievedAt: entity.retrievedAt,
    sectorId: entity.sectorId,
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
    } as unknown as AmenityPublicDto;
  }

  async execute(input: AmenityListQueryDto): Promise<AmenitiesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { amenities: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as AmenitiesListResponseDto;
  }
}
