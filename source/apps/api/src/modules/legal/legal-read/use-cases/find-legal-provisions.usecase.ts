import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { LegalInstrumentDto } from '#/modules/legal/dto/legal-instrument.dto';
import type { LegalProvisionListQueryDto } from '#/modules/legal/dto/legal-provision-list-query.dto';
import type { LegalProvisionPublicDto } from '#/modules/legal/dto/legal-provision-public.dto';
import type { LegalProvisionDto } from '#/modules/legal/dto/legal-provision.dto';
import type { LegalProvisionsListResponseDto } from '#/modules/legal/dto/legal-provisions-list-response.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { LegalProvisionEntity } from '#/modules/legal/entities/legal-provision.entity';
import { listPage } from '#/read/list-page';

/**
 * List legal provisions.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of LegalProvisionEntity); review it and add business rules here.
 */
@Injectable()
export class FindLegalProvisionsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(LegalProvisionEntity);
  }

  private toReadModel(entity: LegalProvisionEntity): LegalProvisionPublicDto {
    return {
    citation: entity.citation,
    code: entity.code,
    content: entity.content,
    createdAt: entity.createdAt,
    heading: entity.heading,
    id: entity.id,
    instrumentId: entity.instrumentId,
    isCurrent: entity.isCurrent,
    kind: entity.kind,
    parentId: entity.parentId,
    previousVersionId: entity.previousVersionId,
    sortOrder: entity.sortOrder,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as LegalProvisionPublicDto;
  }

  async execute(input: LegalProvisionListQueryDto): Promise<LegalProvisionsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { provisions: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as LegalProvisionsListResponseDto;
  }
}
