import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { InstitutionDto } from '#/modules/governance/dto/institution.dto';
import type { OfficeDto } from '#/modules/governance/dto/office.dto';
import type { SelectionProcedureDto } from '#/modules/governance/dto/selection-procedure.dto';
import type { SelectionStagePublicDto } from '#/modules/governance/dto/selection-stage-public.dto';
import type { SelectionStageResponseDto } from '#/modules/governance/dto/selection-stage-response.dto';
import type { SelectionStageDto } from '#/modules/governance/dto/selection-stage.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { SelectionStageEntity } from '#/modules/governance/entities/selection-stage.entity';

/**
 * Get selection stages by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of SelectionStageEntity); review it and add business rules here.
 */
@Injectable()
export class GetSelectionStageByIdUseCase {
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

  async execute(input: { stageId: string }): Promise<SelectionStageResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.stageId } as never);
    if (!entity) throw new NotFoundException('SelectionStage not found');
    return {
      stage: this.toReadModel(entity),
    } as unknown as SelectionStageResponseDto;
  }
}