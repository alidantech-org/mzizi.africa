import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { JurisdictionListQueryDto } from '#/modules/reference/dto/jurisdiction-list-query.dto';
import type { JurisdictionPublicDto } from '#/modules/reference/dto/jurisdiction-public.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { JurisdictionsListResponseDto } from '#/modules/reference/dto/jurisdictions-list-response.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { JurisdictionEntity } from '#/modules/reference/entities/jurisdiction.entity';
import { listPage } from '#/read/list-page';

/**
 * List jurisdictions.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of JurisdictionEntity); review it and add business rules here.
 */
@Injectable()
export class FindJurisdictionsUseCase {
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

  async execute(input: JurisdictionListQueryDto): Promise<JurisdictionsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { jurisdictions: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as JurisdictionsListResponseDto;
  }
}
