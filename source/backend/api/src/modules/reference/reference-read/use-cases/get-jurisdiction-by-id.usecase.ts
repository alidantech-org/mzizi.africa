import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { JurisdictionPublicDto } from '#/modules/reference/dto/jurisdiction-public.dto';
import type { JurisdictionResponseDto } from '#/modules/reference/dto/jurisdiction-response.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { JurisdictionEntity } from '#/modules/reference/entities/jurisdiction.entity';

/**
 * Get jurisdictions by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of JurisdictionEntity); review it and add business rules here.
 */
@Injectable()
export class GetJurisdictionByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(JurisdictionEntity);
  }

  private toReadModel(entity: JurisdictionEntity): JurisdictionPublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    kind: entity.kind,
    name: entity.name,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as JurisdictionPublicDto;
  }

  async execute(input: { jurisdictionId: string }): Promise<JurisdictionResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.jurisdictionId } as never);
    if (!entity) throw new NotFoundException('Jurisdiction not found');
    return {
      jurisdiction: this.toReadModel(entity),
    } as unknown as JurisdictionResponseDto;
  }
}