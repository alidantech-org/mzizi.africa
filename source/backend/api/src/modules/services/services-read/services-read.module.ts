import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JurisdictionEntity } from "#/modules/reference/entities/jurisdiction.entity.ts";
import { AmenityOfficeEntity } from "#/modules/services/entities/amenity-office.entity.ts";
import { AmenityEntity } from "#/modules/services/entities/amenity.entity.ts";
import { PublicServiceEntity } from "#/modules/services/entities/public-service.entity.ts";
import { ServiceDeliveryEntity } from "#/modules/services/entities/service-delivery.entity.ts";
import { ServicesServicesReadServiceImpl } from "#/modules/services/services-read/services-read.service.impl.ts";
import { FindAmenitiesUseCase } from "#/modules/services/services-read/use-cases/find-amenities.usecase.ts";
import { FindAmenityOfficesUseCase } from "#/modules/services/services-read/use-cases/find-amenity-offices.usecase.ts";
import { FindPublicServicesUseCase } from "#/modules/services/services-read/use-cases/find-public-services.usecase.ts";
import { FindServiceDeliveriesUseCase } from "#/modules/services/services-read/use-cases/find-service-deliveries.usecase.ts";
import { GetAmenityByIdUseCase } from "#/modules/services/services-read/use-cases/get-amenity-by-id.usecase.ts";
import { GetAmenityOfficeByIdUseCase } from "#/modules/services/services-read/use-cases/get-amenity-office-by-id.usecase.ts";
import { GetPublicServiceByIdUseCase } from "#/modules/services/services-read/use-cases/get-public-service-by-id.usecase.ts";
import { GetServiceDeliveryByIdUseCase } from "#/modules/services/services-read/use-cases/get-service-delivery-by-id.usecase.ts";

import { ServicesServicesReadController } from "./services-read.controller.ts";
import { ServicesServicesReadService } from "./services-read.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JurisdictionEntity,
      AmenityOfficeEntity,
      AmenityEntity,
      PublicServiceEntity,
      ServiceDeliveryEntity,
    ]),
  ],
  controllers: [ServicesServicesReadController],
  providers: [
    {
      provide: ServicesServicesReadService,
      useClass: ServicesServicesReadServiceImpl satisfies Type<ServicesServicesReadService>,
    },
    FindAmenitiesUseCase,
    FindAmenityOfficesUseCase,
    FindPublicServicesUseCase,
    FindServiceDeliveriesUseCase,
    GetAmenityByIdUseCase,
    GetAmenityOfficeByIdUseCase,
    GetPublicServiceByIdUseCase,
    GetServiceDeliveryByIdUseCase,
  ],
  exports: [ServicesServicesReadService],
})
export class ServicesServicesReadModule {}