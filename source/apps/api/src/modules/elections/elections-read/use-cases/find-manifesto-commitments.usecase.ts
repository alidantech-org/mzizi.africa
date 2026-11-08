import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { CandidateDto } from '#/modules/elections/dto/candidate.dto';
import type { ElectionDto } from '#/modules/elections/dto/election.dto';
import type { ManifestoCommitmentListQueryDto } from '#/modules/elections/dto/manifesto-commitment-list-query.dto';
import type { ManifestoCommitmentPublicDto } from '#/modules/elections/dto/manifesto-commitment-public.dto';
import type { ManifestoCommitmentDto } from '#/modules/elections/dto/manifesto-commitment.dto';
import type { ManifestoCommitmentsListResponseDto } from '#/modules/elections/dto/manifesto-commitments-list-response.dto';
import type { ManifestoDto } from '#/modules/elections/dto/manifesto.dto';
import type { SeatDto } from '#/modules/elections/dto/seat.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { ManifestoCommitmentEntity } from '#/modules/elections/entities/manifesto-commitment.entity';
import { listPage } from '#/read/list-page';

/**
 * List manifesto commitments.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of ManifestoCommitmentEntity); review it and add business rules here.
 */
@Injectable()
export class FindManifestoCommitmentsUseCase {
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

  async execute(input: ManifestoCommitmentListQueryDto): Promise<ManifestoCommitmentsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { commitments: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as ManifestoCommitmentsListResponseDto;
  }
}
