import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { InstitutionDto } from '#/modules/governance/dto/institution.dto';
import type { OfficeHolderListQueryDto } from '#/modules/governance/dto/office-holder-list-query.dto';
import type { OfficeHolderPublicDto } from '#/modules/governance/dto/office-holder-public.dto';
import type { OfficeHolderDto } from '#/modules/governance/dto/office-holder.dto';
import type { OfficeHoldersListResponseDto } from '#/modules/governance/dto/office-holders-list-response.dto';
import type { OfficeDto } from '#/modules/governance/dto/office.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { OfficeHolderEntity } from '#/modules/governance/entities/office-holder.entity';
import { listPage } from '#/read/list-page';

/**
 * List office holders.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of OfficeHolderEntity); review it and add business rules here.
 */
@Injectable()
export class FindOfficeHoldersUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(OfficeHolderEntity);
  }

  private toReadModel(entity: OfficeHolderEntity): OfficeHolderPublicDto {
    return {
    createdAt: entity.createdAt,
    departureReason: entity.departureReason,
    id: entity.id,
    isCurrent: entity.isCurrent,
    legalBasisId: entity.legalBasisId,
    officeId: entity.officeId,
    personId: entity.personId,
    selectionProcedureId: entity.selectionProcedureId,
    status: entity.status,
    termNumber: entity.termNumber,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as OfficeHolderPublicDto;
  }

  async execute(input: OfficeHolderListQueryDto): Promise<OfficeHoldersListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { holders: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as OfficeHoldersListResponseDto;
  }
}
