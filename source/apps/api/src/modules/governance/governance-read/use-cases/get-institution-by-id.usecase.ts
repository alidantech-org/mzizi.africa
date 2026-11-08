import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { InstitutionPublicDto } from '#/modules/governance/dto/institution-public.dto';
import type { InstitutionResponseDto } from '#/modules/governance/dto/institution-response.dto';
import type { InstitutionDto } from '#/modules/governance/dto/institution.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { InstitutionEntity } from '#/modules/governance/entities/institution.entity';

/**
 * Get institutions by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of InstitutionEntity); review it and add business rules here.
 */
@Injectable()
export class GetInstitutionByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(InstitutionEntity);
  }

  private toReadModel(entity: InstitutionEntity): InstitutionPublicDto {
    return {
    branchId: entity.branchId,
    code: entity.code,
    createdAt: entity.createdAt,
    description: entity.description,
    entityId: entity.entityId,
    scopeGeoUnitId: entity.scopeGeoUnitId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    jurisdictionId: entity.jurisdictionId,
    legalBasisId: entity.legalBasisId,
    name: entity.name,
    typeId: entity.typeId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as InstitutionPublicDto;
  }

  async execute(input: { institutionId: string }): Promise<InstitutionResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.institutionId } as never);
    if (!entity) throw new NotFoundException('Institution not found');
    return {
      institution: this.toReadModel(entity),
    } as unknown as InstitutionResponseDto;
  }
}