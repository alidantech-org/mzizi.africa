import { Injectable } from '@nestjs/common';
import type { AmenitiesListResponseDto } from '#/modules/services/dto/amenities-list-response.dto';
import type { AmenityListQueryDto } from '#/modules/services/dto/amenity-list-query.dto';
import type { AmenityOfficeListQueryDto } from '#/modules/services/dto/amenity-office-list-query.dto';
import type { AmenityOfficeResponseDto } from '#/modules/services/dto/amenity-office-response.dto';
import type { AmenityOfficesListResponseDto } from '#/modules/services/dto/amenity-offices-list-response.dto';
import type { AmenityResponseDto } from '#/modules/services/dto/amenity-response.dto';
import type { PublicServiceListQueryDto } from '#/modules/services/dto/public-service-list-query.dto';
import type { PublicServiceResponseDto } from '#/modules/services/dto/public-service-response.dto';
import type { PublicServicesListResponseDto } from '#/modules/services/dto/public-services-list-response.dto';
import type { ServiceDeliveriesListResponseDto } from '#/modules/services/dto/service-deliveries-list-response.dto';
import type { ServiceDeliveryListQueryDto } from '#/modules/services/dto/service-delivery-list-query.dto';
import type { ServiceDeliveryResponseDto } from '#/modules/services/dto/service-delivery-response.dto';
import { FindAmenitiesUseCase } from '#/modules/services/services-read/use-cases/find-amenities.usecase';
import { FindAmenityOfficesUseCase } from '#/modules/services/services-read/use-cases/find-amenity-offices.usecase';
import { FindPublicServicesUseCase } from '#/modules/services/services-read/use-cases/find-public-services.usecase';
import { FindServiceDeliveriesUseCase } from '#/modules/services/services-read/use-cases/find-service-deliveries.usecase';
import { GetAmenityByIdUseCase } from '#/modules/services/services-read/use-cases/get-amenity-by-id.usecase';
import { GetAmenityOfficeByIdUseCase } from '#/modules/services/services-read/use-cases/get-amenity-office-by-id.usecase';
import { GetPublicServiceByIdUseCase } from '#/modules/services/services-read/use-cases/get-public-service-by-id.usecase';
import { GetServiceDeliveryByIdUseCase } from '#/modules/services/services-read/use-cases/get-service-delivery-by-id.usecase';

/**
 * Services Read: implements the generated ServicesServicesReadService contract by
 * delegating to one use case per operation. The feature module binds it to that contract.
 *
 * Scaffolded by Dryv once; this file belongs to the project. New operations need a method here.
 */
@Injectable()
export class ServicesServicesReadServiceImpl {
  constructor(
    private readonly findAmenitiesUseCase: FindAmenitiesUseCase,
    private readonly findAmenityOfficesUseCase: FindAmenityOfficesUseCase,
    private readonly findPublicServicesUseCase: FindPublicServicesUseCase,
    private readonly findServiceDeliveriesUseCase: FindServiceDeliveriesUseCase,
    private readonly getAmenityByIdUseCase: GetAmenityByIdUseCase,
    private readonly getAmenityOfficeByIdUseCase: GetAmenityOfficeByIdUseCase,
    private readonly getPublicServiceByIdUseCase: GetPublicServiceByIdUseCase,
    private readonly getServiceDeliveryByIdUseCase: GetServiceDeliveryByIdUseCase,
  ) {}

  /** List amenities. */
  findAmenities(input: AmenityListQueryDto) {
    return this.findAmenitiesUseCase.execute(input);
  }

  /** List amenity offices. */
  findAmenityOffices(input: AmenityOfficeListQueryDto) {
    return this.findAmenityOfficesUseCase.execute(input);
  }

  /** List public services. */
  findPublicServices(input: PublicServiceListQueryDto) {
    return this.findPublicServicesUseCase.execute(input);
  }

  /** List service deliveries. */
  findServiceDeliveries(input: ServiceDeliveryListQueryDto) {
    return this.findServiceDeliveriesUseCase.execute(input);
  }

  /** Get amenities by id. */
  getAmenityById(input: { amenityId: string }) {
    return this.getAmenityByIdUseCase.execute(input);
  }

  /** Get amenity offices by id. */
  getAmenityOfficeById(input: { amenityOfficeId: string }) {
    return this.getAmenityOfficeByIdUseCase.execute(input);
  }

  /** Get public services by id. */
  getPublicServiceById(input: { serviceId: string }) {
    return this.getPublicServiceByIdUseCase.execute(input);
  }

  /** Get service deliveries by id. */
  getServiceDeliveryById(input: { deliveryId: string }) {
    return this.getServiceDeliveryByIdUseCase.execute(input);
  }
}