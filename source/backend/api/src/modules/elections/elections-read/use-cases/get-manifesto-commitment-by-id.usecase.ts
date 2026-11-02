import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { CandidateDto } from '#/modules/elections/dto/candidate.dto';
import type { ElectionDto } from '#/modules/elections/dto/election.dto';
import type { ManifestoCommitmentPublicDto } from '#/modules/elections/dto/manifesto-commitment-public.dto';
import type { ManifestoCommitmentResponseDto } from '#/modules/elections/dto/manifesto-commitment-response.dto';
import type { ManifestoCommitmentDto } from '#/modules/elections/dto/manifesto-commitment.dto';
import type { ManifestoDto } from '#/modules/elections/dto/manifesto.dto';
import type { SeatDto } from '#/modules/elections/dto/seat.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { ManifestoCommitmentEntity } from '#/modules/elections/entities/manifesto-commitment.entity';

/**
 * Get manifesto commitments by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of ManifestoCommitmentEntity); review it and add business rules here.
 */
@Injectable()
export class GetManifestoCommitmentByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ManifestoCommitmentEntity);
  }

  private toReadModel(entity: ManifestoCommitmentEntity): ManifestoCommitmentPublicDto {
    return {
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    manifestoId: entity.manifestoId,
    parentId: entity.parentId,
    sortOrder: entity.sortOrder,
    text: entity.text,
    topicId: entity.topicId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as ManifestoCommitmentPublicDto;
  }

  async execute(input: { commitmentId: string }): Promise<ManifestoCommitmentResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.commitmentId } as never);
    if (!entity) throw new NotFoundException('ManifestoCommitment not found');
    return {
      commitment: this.toReadModel(entity),
    } as unknown as ManifestoCommitmentResponseDto;
  }
}