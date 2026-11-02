import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { AmenityOfficePublicDto } from '#/modules/services/dto/amenity-office-public.dto';
import type { AmenityOfficeResponseDto } from '#/modules/services/dto/amenity-office-response.dto';
import type { AmenityOfficeDto } from '#/modules/services/dto/amenity-office.dto';
import type { AmenityDto } from '#/modules/services/dto/amenity.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { AmenityOfficeEntity } from '#/modules/services/entities/amenity-office.entity';

/**
 * Get amenity offices by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of AmenityOfficeEntity); review it and add business rules here.
 */
@Injectable()
export class GetAmenityOfficeByIdUseCase {
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

  async execute(input: { amenityOfficeId: string }): Promise<AmenityOfficeResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.amenityOfficeId } as never);
    if (!entity) throw new NotFoundException('AmenityOffice not found');
    return {
      amenityOffice: this.toReadModel(entity),
    } as unknown as AmenityOfficeResponseDto;
  }
}