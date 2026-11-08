import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ElectionDto } from '#/modules/elections/dto/election.dto';
import type { ReferendumOptionDto } from '#/modules/elections/dto/referendum-option.dto';
import type { ReferendumQuestionDto } from '#/modules/elections/dto/referendum-question.dto';
import type { ReferendumResultListQueryDto } from '#/modules/elections/dto/referendum-result-list-query.dto';
import type { ReferendumResultPublicDto } from '#/modules/elections/dto/referendum-result-public.dto';
import type { ReferendumResultDto } from '#/modules/elections/dto/referendum-result.dto';
import type { ReferendumResultsListResponseDto } from '#/modules/elections/dto/referendum-results-list-response.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { ReferendumResultEntity } from '#/modules/elections/entities/referendum-result.entity';
import { listPage } from '#/read/list-page';

/**
 * List referendum results.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of ReferendumResultEntity); review it and add business rules here.
 */
@Injectable()
export class FindReferendumResultsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ReferendumResultEntity);
  }

  private toReadModel(entity: ReferendumResultEntity): ReferendumResultPublicDto {
    return {
    createdAt: entity.createdAt,
    declaredAt: entity.declaredAt,
    declaringInstitutionId: entity.declaringInstitutionId,
    evidenceForm: entity.evidenceForm,
    geoUnitId: entity.geoUnitId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    optionId: entity.optionId,
    resultLevelId: entity.resultLevelId,
    resultStatus: entity.resultStatus,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    votes: entity.votes,
    } as unknown as ReferendumResultPublicDto;
  }

  async execute(input: ReferendumResultListQueryDto): Promise<ReferendumResultsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { referendumResults: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as ReferendumResultsListResponseDto;
  }
}
