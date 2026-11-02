import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { InstitutionDto } from '#/modules/governance/dto/institution.dto';
import type { OfficeListQueryDto } from '#/modules/governance/dto/office-list-query.dto';
import type { OfficePublicDto } from '#/modules/governance/dto/office-public.dto';
import type { OfficeDto } from '#/modules/governance/dto/office.dto';
import type { OfficesListResponseDto } from '#/modules/governance/dto/offices-list-response.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { OfficeEntity } from '#/modules/governance/entities/office.entity';

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
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    description: entity.description,
    id: entity.id,
    institutionId: entity.institutionId,
    isCurrent: entity.isCurrent,
    isSingleton: entity.isSingleton,
    licence: entity.licence,
    method: entity.method,
    name: entity.name,
    parentOfficeId: entity.parentOfficeId,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as OfficePublicDto;
  }

  async execute(input: OfficeListQueryDto): Promise<OfficesListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.institutionId !== undefined) where.institutionId = input.institutionId;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<OfficeEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      offices: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as OfficesListResponseDto;
  }
}