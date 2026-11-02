import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ElectionListQueryDto } from '#/modules/elections/dto/election-list-query.dto';
import type { ElectionPublicDto } from '#/modules/elections/dto/election-public.dto';
import type { ElectionDto } from '#/modules/elections/dto/election.dto';
import type { ElectionsListResponseDto } from '#/modules/elections/dto/elections-list-response.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { ElectionEntity } from '#/modules/elections/entities/election.entity';

/**
 * List elections.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of ElectionEntity); review it and add business rules here.
 */
@Injectable()
export class FindElectionsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ElectionEntity);
  }

  private toReadModel(entity: ElectionEntity): ElectionPublicDto {
    return {
    administeringInstitutionId: entity.administeringInstitutionId,
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    geoUnitId: entity.geoUnitId,
    heldDate: entity.heldDate,
    id: entity.id,
    isCurrent: entity.isCurrent,
    jurisdictionId: entity.jurisdictionId,
    legalBasisId: entity.legalBasisId,
    licence: entity.licence,
    method: entity.method,
    name: entity.name,
    retrievedAt: entity.retrievedAt,
    scheduledDate: entity.scheduledDate,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    status: entity.status,
    toolOrModel: entity.toolOrModel,
    typeId: entity.typeId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as ElectionPublicDto;
  }

  async execute(input: ElectionListQueryDto): Promise<ElectionsListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.jurisdictionId !== undefined) where.jurisdictionId = input.jurisdictionId;
    if (input.status !== undefined) where.status = input.status;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<ElectionEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      elections: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as ElectionsListResponseDto;
  }
}