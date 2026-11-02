import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { AmenityOfficeListQueryDto } from '#/modules/services/dto/amenity-office-list-query.dto';
import type { AmenityOfficePublicDto } from '#/modules/services/dto/amenity-office-public.dto';
import type { AmenityOfficeDto } from '#/modules/services/dto/amenity-office.dto';
import type { AmenityOfficesListResponseDto } from '#/modules/services/dto/amenity-offices-list-response.dto';
import type { AmenityDto } from '#/modules/services/dto/amenity.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { AmenityOfficeEntity } from '#/modules/services/entities/amenity-office.entity';

/**
 * List amenity offices.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of AmenityOfficeEntity); review it and add business rules here.
 */
@Injectable()
export class FindAmenityOfficesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(AmenityOfficeEntity);
  }

  private toReadModel(entity: AmenityOfficeEntity): AmenityOfficePublicDto {
    return {
    amenityId: entity.amenityId,
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    licence: entity.licence,
    method: entity.method,
    officeId: entity.officeId,
    retrievedAt: entity.retrievedAt,
    roleKindId: entity.roleKindId,
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
    } as unknown as AmenityOfficePublicDto;
  }

  async execute(input: AmenityOfficeListQueryDto): Promise<AmenityOfficesListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.amenityId !== undefined) where.amenityId = input.amenityId;
    if (input.officeId !== undefined) where.officeId = input.officeId;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<AmenityOfficeEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      amenityOffices: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as AmenityOfficesListResponseDto;
  }
}