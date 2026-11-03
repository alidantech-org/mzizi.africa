import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ElectionDto } from '#/modules/elections/dto/election.dto';
import type { ReferendumQuestionListQueryDto } from '#/modules/elections/dto/referendum-question-list-query.dto';
import type { ReferendumQuestionPublicDto } from '#/modules/elections/dto/referendum-question-public.dto';
import type { ReferendumQuestionDto } from '#/modules/elections/dto/referendum-question.dto';
import type { ReferendumQuestionsListResponseDto } from '#/modules/elections/dto/referendum-questions-list-response.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { ReferendumQuestionEntity } from '#/modules/elections/entities/referendum-question.entity';
import { listPage } from '#/read/list-page';

/**
 * List referendum questions.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of ReferendumQuestionEntity); review it and add business rules here.
 */
@Injectable()
export class FindReferendumQuestionsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ReferendumQuestionEntity);
  }

  private toReadModel(entity: ReferendumQuestionEntity): ReferendumQuestionPublicDto {
    return {
    code: entity.code,
    createdAt: entity.createdAt,
    electionId: entity.electionId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    position: entity.position,
    text: entity.text,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as ReferendumQuestionPublicDto;
  }

  async execute(input: ReferendumQuestionListQueryDto): Promise<ReferendumQuestionsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { questions: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as ReferendumQuestionsListResponseDto;
  }
}
