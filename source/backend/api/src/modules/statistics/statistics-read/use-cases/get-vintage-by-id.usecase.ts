import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { VintagePublicDto } from '#/modules/statistics/dto/vintage-public.dto';
import type { VintageResponseDto } from '#/modules/statistics/dto/vintage-response.dto';
import type { VintageDto } from '#/modules/statistics/dto/vintage.dto';
import { VintageEntity } from '#/modules/statistics/entities/vintage.entity';

/**
 * Get release vintages by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of VintageEntity); review it and add business rules here.
 */
@Injectable()
export class GetVintageByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(VintageEntity);
  }

  private toReadModel(entity: VintageEntity): VintagePublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    label: entity.label,
    publisherInstitutionId: entity.publisherInstitutionId,
    releasedOn: entity.releasedOn,
    supersedesId: entity.supersedesId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as VintagePublicDto;
  }

  async execute(input: { vintageId: string }): Promise<VintageResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.vintageId } as never);
    if (!entity) throw new NotFoundException('Vintage not found');
    return {
      vintage: this.toReadModel(entity),
    } as unknown as VintageResponseDto;
  }
}