import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ElectionDto } from '#/modules/elections/dto/election.dto';
import type { ReferendumOptionPublicDto } from '#/modules/elections/dto/referendum-option-public.dto';
import type { ReferendumOptionResponseDto } from '#/modules/elections/dto/referendum-option-response.dto';
import type { ReferendumOptionDto } from '#/modules/elections/dto/referendum-option.dto';
import type { ReferendumQuestionDto } from '#/modules/elections/dto/referendum-question.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { ReferendumOptionEntity } from '#/modules/elections/entities/referendum-option.entity';

/**
 * Get referendum options by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of ReferendumOptionEntity); review it and add business rules here.
 */
@Injectable()
export class GetReferendumOptionByIdUseCase {
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

  async execute(input: { optionId: string }): Promise<ReferendumOptionResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.optionId } as never);
    if (!entity) throw new NotFoundException('ReferendumOption not found');
    return {
      option: this.toReadModel(entity),
    } as unknown as ReferendumOptionResponseDto;
  }
}