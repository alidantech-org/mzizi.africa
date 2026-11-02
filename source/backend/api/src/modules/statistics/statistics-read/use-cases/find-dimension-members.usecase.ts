import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { DimensionMemberListQueryDto } from '#/modules/statistics/dto/dimension-member-list-query.dto';
import type { DimensionMemberPublicDto } from '#/modules/statistics/dto/dimension-member-public.dto';
import type { DimensionMemberDto } from '#/modules/statistics/dto/dimension-member.dto';
import type { DimensionMembersListResponseDto } from '#/modules/statistics/dto/dimension-members-list-response.dto';
import type { DimensionDto } from '#/modules/statistics/dto/dimension.dto';
import { DimensionMemberEntity } from '#/modules/statistics/entities/dimension-member.entity';
import { listPage } from '#/read/list-page';

/**
 * List dimension members.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of DimensionMemberEntity); review it and add business rules here.
 */
@Injectable()
export class FindDimensionMembersUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(DimensionMemberEntity);
  }

  private toReadModel(entity: DimensionMemberEntity): DimensionMemberPublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    dimensionId: entity.dimensionId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    label: entity.label,
    parentId: entity.parentId,
    referenceCode: entity.referenceCode,
    sortOrder: entity.sortOrder,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as DimensionMemberPublicDto;
  }

  async execute(input: DimensionMemberListQueryDto): Promise<DimensionMembersListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { members: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as DimensionMembersListResponseDto;
  }
}
