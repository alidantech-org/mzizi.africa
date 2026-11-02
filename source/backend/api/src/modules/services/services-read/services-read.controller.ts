import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  ParseBoolPipe,
  ParseFloatPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";

import { Cookie } from "#/modules/common/server/http/cookie.decorator.ts";
import { AmenitiesListResponseDto } from "#/modules/services/dto/amenities-list-response.dto.ts";
import { AmenityListQueryDto } from "#/modules/services/dto/amenity-list-query.dto.ts";
import { AmenityOfficeListQueryDto } from "#/modules/services/dto/amenity-office-list-query.dto.ts";
import { AmenityOfficeResponseDto } from "#/modules/services/dto/amenity-office-response.dto.ts";
import { AmenityOfficesListResponseDto } from "#/modules/services/dto/amenity-offices-list-response.dto.ts";
import { AmenityResponseDto } from "#/modules/services/dto/amenity-response.dto.ts";
import { PublicServiceListQueryDto } from "#/modules/services/dto/public-service-list-query.dto.ts";
import { PublicServiceResponseDto } from "#/modules/services/dto/public-service-response.dto.ts";
import { PublicServicesListResponseDto } from "#/modules/services/dto/public-services-list-response.dto.ts";
import { ServiceDeliveriesListResponseDto } from "#/modules/services/dto/service-deliveries-list-response.dto.ts";
import { ServiceDeliveryListQueryDto } from "#/modules/services/dto/service-delivery-list-query.dto.ts";
import { ServiceDeliveryResponseDto } from "#/modules/services/dto/service-delivery-response.dto.ts";
import { ServicesServicesReadService } from "./services-read.service.ts";

@Controller()
export class ServicesServicesReadController {
  constructor(private readonly service: ServicesServicesReadService) {}


  @Get("/v1/services/amenities")
  @HttpCode(200)
  findAmenities(
    @Query() input: AmenityListQueryDto,
  ): Promise<AmenitiesListResponseDto> {
    return this.service.findAmenities(input);
  }


  @Get("/v1/services/amenity-offices")
  @HttpCode(200)
  findAmenityOffices(
    @Query() input: AmenityOfficeListQueryDto,
  ): Promise<AmenityOfficesListResponseDto> {
    return this.service.findAmenityOffices(input);
  }


  @Get("/v1/services/services")
  @HttpCode(200)
  findPublicServices(
    @Query() input: PublicServiceListQueryDto,
  ): Promise<PublicServicesListResponseDto> {
    return this.service.findPublicServices(input);
  }


  @Get("/v1/services/deliveries")
  @HttpCode(200)
  findServiceDeliveries(
    @Query() input: ServiceDeliveryListQueryDto,
  ): Promise<ServiceDeliveriesListResponseDto> {
    return this.service.findServiceDeliveries(input);
  }


  @Get("/v1/services/amenities/:amenityId")
  @HttpCode(200)
  getAmenityById(
    @Param("amenityId") amenityId: string,
  ): Promise<AmenityResponseDto> {
    return this.service.getAmenityById({ amenityId });
  }


  @Get("/v1/services/amenity-offices/:amenityOfficeId")
  @HttpCode(200)
  getAmenityOfficeById(
    @Param("amenityOfficeId") amenityOfficeId: string,
  ): Promise<AmenityOfficeResponseDto> {
    return this.service.getAmenityOfficeById({ amenityOfficeId });
  }


  @Get("/v1/services/services/:serviceId")
  @HttpCode(200)
  getPublicServiceById(
    @Param("serviceId") serviceId: string,
  ): Promise<PublicServiceResponseDto> {
    return this.service.getPublicServiceById({ serviceId });
  }


  @Get("/v1/services/deliveries/:deliveryId")
  @HttpCode(200)
  getServiceDeliveryById(
    @Param("deliveryId") deliveryId: string,
  ): Promise<ServiceDeliveryResponseDto> {
    return this.service.getServiceDeliveryById({ deliveryId });
  }
}