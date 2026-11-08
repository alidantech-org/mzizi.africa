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
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { SelectionStageEntity } from '#/modules/governance/entities/selection-stage.entity';
import { listPage } from '#/read/list-page';

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
    createdAt: entity.createdAt,
    description: entity.description,
    id: entity.id,
    isCurrent: entity.isCurrent,
    kind: entity.kind,
    procedureId: entity.procedureId,
    stageOrder: entity.stageOrder,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as SelectionStagePublicDto;
  }

  async execute(input: SelectionStageListQueryDto): Promise<SelectionStagesListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { stages: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as SelectionStagesListResponseDto;
  }
}
