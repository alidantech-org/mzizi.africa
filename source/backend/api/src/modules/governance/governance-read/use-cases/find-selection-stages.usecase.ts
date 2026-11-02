import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { InstitutionDto } from '#/modules/governance/dto/institution.dto';
import type { OfficeDto } from '#/modules/governance/dto/office.dto';
import type { SelectionProcedureDto } from '#/modules/governance/dto/selection-procedure.dto';
import type { SelectionStageListQueryDto } from '#/modules/governance/dto/selection-stage-list-query.dto';
import type { SelectionStagePublicDto } from '#/modules/governance/dto/selection-stage-public.dto';
import type { SelectionStageDto } from '#/modules/governance/dto/selection-stage.dto';
import type { SelectionStagesListResponseDto } from '#/modules/governance/dto/selection-stages-list-response.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { SelectionStageEntity } from '#/modules/governance/entities/selection-stage.entity';

/**
 * List selection stages.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of SelectionStageEntity); review it and add business rules here.
 */
@Injectable()
export class FindSelectionStagesUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SelectionStageEntity);
  }

  private toReadModel(entity: SelectionStageEntity): SelectionStagePublicDto {
    return {
    actorInstitutionId: entity.actorInstitutionId,
    actorOfficeId: entity.actorOfficeId,
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    description: entity.description,
    id: entity.id,
    isCurrent: entity.isCurrent,
    kind: entity.kind,
    licence: entity.licence,
    method: entity.method,
    procedureId: entity.procedureId,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    stageOrder: entity.stageOrder,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as SelectionStagePublicDto;
  }

  async execute(input: SelectionStageListQueryDto): Promise<SelectionStagesListResponseDto> {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 20);
    const where: Record<string, unknown> = {};
    if (input.procedureId !== undefined) where.procedureId = input.procedureId;
    const [rows, total] = await this.repository.findAndCount({
      where: where as FindOptionsWhere<SelectionStageEntity>,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      stages: rows.map((entity) => this.toReadModel(entity)),
    meta: {
      limit: limit,
      page: page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
    } as unknown as SelectionStagesListResponseDto;
  }
}