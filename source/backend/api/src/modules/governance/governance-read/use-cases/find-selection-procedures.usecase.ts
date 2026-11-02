import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { InstitutionDto } from '#/modules/governance/dto/institution.dto';
import type { OfficeDto } from '#/modules/governance/dto/office.dto';
import type { SelectionProcedureListQueryDto } from '#/modules/governance/dto/selection-procedure-list-query.dto';
import type { SelectionProcedurePublicDto } from '#/modules/governance/dto/selection-procedure-public.dto';
import type { SelectionProcedureDto } from '#/modules/governance/dto/selection-procedure.dto';
import type { SelectionProceduresListResponseDto } from '#/modules/governance/dto/selection-procedures-list-response.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { SelectionProcedureEntity } from '#/modules/governance/entities/selection-procedure.entity';
import { listPage } from '#/read/list-page';

/**
 * List selection procedures.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of SelectionProcedureEntity); review it and add business rules here.
 */
@Injectable()
export class FindSelectionProceduresUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SelectionProcedureEntity);
  }

  private toReadModel(entity: SelectionProcedureEntity): SelectionProcedurePublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    description: entity.description,
    id: entity.id,
    isCurrent: entity.isCurrent,
    legalBasisId: entity.legalBasisId,
    licence: entity.licence,
    method: entity.method,
    methodId: entity.methodId,
    officeId: entity.officeId,
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
    } as unknown as SelectionProcedurePublicDto;
  }

  async execute(input: SelectionProcedureListQueryDto): Promise<SelectionProceduresListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { procedures: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as SelectionProceduresListResponseDto;
  }
}
