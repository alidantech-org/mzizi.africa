import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { EvidenceReferencePublicDto } from '#/modules/audit/dto/evidence-reference-public.dto';
import type { EvidenceReferenceResponseDto } from '#/modules/audit/dto/evidence-reference-response.dto';
import type { EvidenceReferenceDto } from '#/modules/audit/dto/evidence-reference.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import { EvidenceReferenceEntity } from '#/modules/audit/entities/evidence-reference.entity';

/**
 * Get evidence references by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of EvidenceReferenceEntity); review it and add business rules here.
 */
@Injectable()
export class GetEvidenceReferenceByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(EvidenceReferenceEntity);
  }

  private toReadModel(entity: EvidenceReferenceEntity): EvidenceReferencePublicDto {
    return {
    actorId: entity.actorId,
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    createdAt: entity.createdAt,
    id: entity.id,
    mediaType: entity.mediaType,
    note: entity.note,
    sizeBytes: entity.sizeBytes,
    targetId: entity.targetId,
    targetKind: entity.targetKind,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as EvidenceReferencePublicDto;
  }

  async execute(input: { evidenceId: string }): Promise<EvidenceReferenceResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.evidenceId } as never);
    if (!entity) throw new NotFoundException('EvidenceReference not found');
    return {
      evidence: this.toReadModel(entity),
    } as unknown as EvidenceReferenceResponseDto;
  }
}