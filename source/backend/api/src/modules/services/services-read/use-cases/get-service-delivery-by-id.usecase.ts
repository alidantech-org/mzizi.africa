import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { AmenityDto } from '#/modules/services/dto/amenity.dto';
import type { ServiceDeliveryPublicDto } from '#/modules/services/dto/service-delivery-public.dto';
import type { ServiceDeliveryResponseDto } from '#/modules/services/dto/service-delivery-response.dto';
import type { ServiceDeliveryDto } from '#/modules/services/dto/service-delivery.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { ServiceDeliveryEntity } from '#/modules/services/entities/service-delivery.entity';

/**
 * Get service deliveries by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of ServiceDeliveryEntity); review it and add business rules here.
 */
@Injectable()
export class GetServiceDeliveryByIdUseCase {
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

  async execute(input: { deliveryId: string }): Promise<ServiceDeliveryResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.deliveryId } as never);
    if (!entity) throw new NotFoundException('ServiceDelivery not found');
    return {
      delivery: this.toReadModel(entity),
    } as unknown as ServiceDeliveryResponseDto;
  }
}