import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { InstitutionListQueryDto } from '#/modules/governance/dto/institution-list-query.dto';
import type { InstitutionPublicDto } from '#/modules/governance/dto/institution-public.dto';
import type { InstitutionDto } from '#/modules/governance/dto/institution.dto';
import type { InstitutionsListResponseDto } from '#/modules/governance/dto/institutions-list-response.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { InstitutionEntity } from '#/modules/governance/entities/institution.entity';
import { listPage } from '#/read/list-page';

/**
 * List institutions.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of InstitutionEntity); review it and add business rules here.
 */
@Injectable()
export class FindInstitutionsUseCase {
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
    geoUnitId: entity.geoUnitId,
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

  async execute(input: InstitutionListQueryDto): Promise<InstitutionsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { institutions: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as InstitutionsListResponseDto;
  }
}
