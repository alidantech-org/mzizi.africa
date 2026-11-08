import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { AmenityDto } from '#/modules/services/dto/amenity.dto';
import type { ServiceDeliveriesListResponseDto } from '#/modules/services/dto/service-deliveries-list-response.dto';
import type { ServiceDeliveryListQueryDto } from '#/modules/services/dto/service-delivery-list-query.dto';
import type { ServiceDeliveryPublicDto } from '#/modules/services/dto/service-delivery-public.dto';
import type { ServiceDeliveryDto } from '#/modules/services/dto/service-delivery.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { ServiceDeliveryEntity } from '#/modules/services/entities/service-delivery.entity';
import { listPage } from '#/read/list-page';

/**
 * List service deliveries.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of ServiceDeliveryEntity); review it and add business rules here.
 */
@Injectable()
export class FindServiceDeliveriesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ServiceDeliveryEntity);
  }

  private toReadModel(entity: ServiceDeliveryEntity): ServiceDeliveryPublicDto {
    return {
    amenityId: entity.amenityId,
    budgetId: entity.budgetId,
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    responsibleOfficeId: entity.responsibleOfficeId,
    serviceId: entity.serviceId,
    status: entity.status,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as ServiceDeliveryPublicDto;
  }

  async execute(input: ServiceDeliveryListQueryDto): Promise<ServiceDeliveriesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { deliveries: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as ServiceDeliveriesListResponseDto;
  }
}
