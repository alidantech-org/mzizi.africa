import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, DeepPartial } from 'typeorm';
import type { CreateEvidenceReferenceBodyDto } from '#/modules/audit/dto/create-evidence-reference-body.dto';
import type { EvidenceReferencePublicDto } from '#/modules/audit/dto/evidence-reference-public.dto';
import type { EvidenceReferenceResponseDto } from '#/modules/audit/dto/evidence-reference-response.dto';
import type { EvidenceReferenceDto } from '#/modules/audit/dto/evidence-reference.dto';
import type { ActorContextDto } from '#/modules/shared/dto/actor-context.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import { EvidenceReferenceEntity } from '#/modules/audit/entities/evidence-reference.entity';

/**
 * Attach an evidence reference (a file artifact held by the files service) to a record.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting create implementation from the contract (response read projection
 * of EvidenceReferenceEntity); review it and add business rules here.
 */
@Injectable()
export class CreateEvidenceReferenceUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(EvidenceReferenceEntity);
  }

  /** System fields the contract leaves to the implementation: timestamps and the version. */
  private stamp(entity: EvidenceReferenceEntity, created: boolean): void {
    const now = new Date();
    const target = entity as unknown as Record<string, unknown>;
    const has = (name: string) => this.repository.metadata.findColumnWithPropertyName(name) !== undefined;
    if (created && has("createdAt")) target.createdAt = now;
    if (has("updatedAt")) target.updatedAt = now;
    if (has("version")) target.version = created ? 1 : Number(target.version ?? 0) + 1;
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

  async execute(input: CreateEvidenceReferenceBodyDto): Promise<EvidenceReferenceResponseDto> {
    const entity = this.repository.create(input as DeepPartial<EvidenceReferenceEntity>);
    this.stamp(entity, true);
    const saved = await this.repository.save(entity);
    return {
      evidence: this.toReadModel(saved),
    } as unknown as EvidenceReferenceResponseDto;
  }
}