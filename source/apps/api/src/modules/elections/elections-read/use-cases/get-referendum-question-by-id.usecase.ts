import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ElectionDto } from '#/modules/elections/dto/election.dto';
import type { ReferendumQuestionPublicDto } from '#/modules/elections/dto/referendum-question-public.dto';
import type { ReferendumQuestionResponseDto } from '#/modules/elections/dto/referendum-question-response.dto';
import type { ReferendumQuestionDto } from '#/modules/elections/dto/referendum-question.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { ReferendumQuestionEntity } from '#/modules/elections/entities/referendum-question.entity';

/**
 * Get referendum questions by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of ReferendumQuestionEntity); review it and add business rules here.
 */
@Injectable()
export class GetReferendumQuestionByIdUseCase {
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

  async execute(input: { questionId: string }): Promise<ReferendumQuestionResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.questionId } as never);
    if (!entity) throw new NotFoundException('ReferendumQuestion not found');
    return {
      question: this.toReadModel(entity),
    } as unknown as ReferendumQuestionResponseDto;
  }
}