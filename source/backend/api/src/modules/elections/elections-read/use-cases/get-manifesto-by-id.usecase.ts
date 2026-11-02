import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { CandidateDto } from '#/modules/elections/dto/candidate.dto';
import type { ElectionDto } from '#/modules/elections/dto/election.dto';
import type { ManifestoPublicDto } from '#/modules/elections/dto/manifesto-public.dto';
import type { ManifestoResponseDto } from '#/modules/elections/dto/manifesto-response.dto';
import type { ManifestoDto } from '#/modules/elections/dto/manifesto.dto';
import type { SeatDto } from '#/modules/elections/dto/seat.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { ManifestoEntity } from '#/modules/elections/entities/manifesto.entity';

/**
 * Get manifestos by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of ManifestoEntity); review it and add business rules here.
 */
@Injectable()
export class GetManifestoByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ManifestoEntity);
  }

  private toReadModel(entity: ManifestoEntity): ManifestoPublicDto {
    return {
    candidateId: entity.candidateId,
    createdAt: entity.createdAt,
    documentUrl: entity.documentUrl,
    id: entity.id,
    isCurrent: entity.isCurrent,
    language: entity.language,
    publishedOn: entity.publishedOn,
    title: entity.title,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as ManifestoPublicDto;
  }

  async execute(input: { manifestoId: string }): Promise<ManifestoResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.manifestoId } as never);
    if (!entity) throw new NotFoundException('Manifesto not found');
    return {
      manifesto: this.toReadModel(entity),
    } as unknown as ManifestoResponseDto;
  }
}