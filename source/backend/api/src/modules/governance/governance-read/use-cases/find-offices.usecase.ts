import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { InstitutionDto } from '#/modules/governance/dto/institution.dto';
import type { OfficeListQueryDto } from '#/modules/governance/dto/office-list-query.dto';
import type { OfficePublicDto } from '#/modules/governance/dto/office-public.dto';
import type { OfficeDto } from '#/modules/governance/dto/office.dto';
import type { OfficesListResponseDto } from '#/modules/governance/dto/offices-list-response.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { OfficeEntity } from '#/modules/governance/entities/office.entity';
import { listPage } from '#/read/list-page';

/**
 * List offices.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of OfficeEntity); review it and add business rules here.
 */
@Injectable()
export class FindOfficesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(OfficeEntity);
  }

  private toReadModel(entity: OfficeEntity): OfficePublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    description: entity.description,
    id: entity.id,
    institutionId: entity.institutionId,
    isCurrent: entity.isCurrent,
    isSingleton: entity.isSingleton,
    name: entity.name,
    parentOfficeId: entity.parentOfficeId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as OfficePublicDto;
  }

  async execute(input: OfficeListQueryDto): Promise<OfficesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { offices: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as OfficesListResponseDto;
  }
}
