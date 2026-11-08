import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import type { VerificationListQueryDto } from '#/modules/source/dto/verification-list-query.dto';
import type { VerificationPublicDto } from '#/modules/source/dto/verification-public.dto';
import type { VerificationDto } from '#/modules/source/dto/verification.dto';
import type { VerificationsListResponseDto } from '#/modules/source/dto/verifications-list-response.dto';
import { VerificationEntity } from '#/modules/source/entities/verification.entity';
import { listPage } from '#/read/list-page';

/**
 * List verifications.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of VerificationEntity); review it and add business rules here.
 */
@Injectable()
export class FindVerificationsUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(VerificationEntity);
  }

  private toReadModel(entity: VerificationEntity): VerificationPublicDto {
    return {
    createdAt: entity.createdAt,
    decidedBy: entity.decidedBy,
    decisionId: entity.decisionId,
    id: entity.id,
    isCurrent: entity.isCurrent,
    rationale: entity.rationale,
    state: entity.state,
    targetId: entity.targetId,
    targetKind: entity.targetKind,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as VerificationPublicDto;
  }

  async execute(input: VerificationListQueryDto): Promise<VerificationsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input);
    return { verifications: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as VerificationsListResponseDto;
  }
}
