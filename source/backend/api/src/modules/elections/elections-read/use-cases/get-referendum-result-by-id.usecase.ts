import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ElectionDto } from '#/modules/elections/dto/election.dto';
import type { ReferendumOptionDto } from '#/modules/elections/dto/referendum-option.dto';
import type { ReferendumQuestionDto } from '#/modules/elections/dto/referendum-question.dto';
import type { ReferendumResultPublicDto } from '#/modules/elections/dto/referendum-result-public.dto';
import type { ReferendumResultResponseDto } from '#/modules/elections/dto/referendum-result-response.dto';
import type { ReferendumResultDto } from '#/modules/elections/dto/referendum-result.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { ReferendumResultEntity } from '#/modules/elections/entities/referendum-result.entity';

/**
 * Get referendum results by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of ReferendumResultEntity); review it and add business rules here.
 */
@Injectable()
export class GetReferendumResultByIdUseCase {
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

  async execute(input: { referendumResultId: string }): Promise<ReferendumResultResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.referendumResultId } as never);
    if (!entity) throw new NotFoundException('ReferendumResult not found');
    return {
      referendumResult: this.toReadModel(entity),
    } as unknown as ReferendumResultResponseDto;
  }
}