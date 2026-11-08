import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { VerificationPublicDto } from '#/modules/source/dto/verification-public.dto';
import type { VerificationResponseDto } from '#/modules/source/dto/verification-response.dto';
import type { VerificationDto } from '#/modules/source/dto/verification.dto';
import { VerificationEntity } from '#/modules/source/entities/verification.entity';

/**
 * Get verifications by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of VerificationEntity); review it and add business rules here.
 */
@Injectable()
export class GetVerificationByIdUseCase {
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

  async execute(input: { verificationId: string }): Promise<VerificationResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.verificationId } as never);
    if (!entity) throw new NotFoundException('Verification not found');
    return {
      verification: this.toReadModel(entity),
    } as unknown as VerificationResponseDto;
  }
}