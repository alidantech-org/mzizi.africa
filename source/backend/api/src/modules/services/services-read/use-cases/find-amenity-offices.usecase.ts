import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { AmenityOfficeListQueryDto } from '#/modules/services/dto/amenity-office-list-query.dto';
import type { AmenityOfficePublicDto } from '#/modules/services/dto/amenity-office-public.dto';
import type { AmenityOfficeDto } from '#/modules/services/dto/amenity-office.dto';
import type { AmenityOfficesListResponseDto } from '#/modules/services/dto/amenity-offices-list-response.dto';
import type { AmenityDto } from '#/modules/services/dto/amenity.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { AmenityOfficeEntity } from '#/modules/services/entities/amenity-office.entity';
import { listPage } from '#/read/list-page';

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
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    officeId: entity.officeId,
    roleKindId: entity.roleKindId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as AmenityOfficePublicDto;
  }

  async execute(input: AmenityOfficeListQueryDto): Promise<AmenityOfficesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { amenityOffices: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as AmenityOfficesListResponseDto;
  }
}
