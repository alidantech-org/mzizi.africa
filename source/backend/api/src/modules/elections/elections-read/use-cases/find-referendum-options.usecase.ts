import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ElectionDto } from '#/modules/elections/dto/election.dto';
import type { ReferendumOptionListQueryDto } from '#/modules/elections/dto/referendum-option-list-query.dto';
import type { ReferendumOptionPublicDto } from '#/modules/elections/dto/referendum-option-public.dto';
import type { ReferendumOptionDto } from '#/modules/elections/dto/referendum-option.dto';
import type { ReferendumOptionsListResponseDto } from '#/modules/elections/dto/referendum-options-list-response.dto';
import type { ReferendumQuestionDto } from '#/modules/elections/dto/referendum-question.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { ReferendumOptionEntity } from '#/modules/elections/entities/referendum-option.entity';
import { listPage } from '#/read/list-page';

/**
 * List referendum options.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of ReferendumOptionEntity); review it and add business rules here.
 */
@Injectable()
export class FindReferendumOptionsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ReferendumOptionEntity);
  }

  private toReadModel(entity: ReferendumOptionEntity): ReferendumOptionPublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    label: entity.label,
    position: entity.position,
    questionId: entity.questionId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as ReferendumOptionPublicDto;
  }

  async execute(input: ReferendumOptionListQueryDto): Promise<ReferendumOptionsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { options: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as ReferendumOptionsListResponseDto;
  }
}
