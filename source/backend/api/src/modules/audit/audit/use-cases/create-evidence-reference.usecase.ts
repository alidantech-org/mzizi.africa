import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, DeepPartial } from 'typeorm';
import { requireActor } from '#/auth/actor-context';
import { writeDataSource } from '#/database/write-database';
import { assertTarget } from '#/modules/audit/audit/target';
import type { EvidenceReferenceResponseDto } from '#/modules/audit/dto/evidence-reference-response.dto';
import type { CreateEvidenceReferenceBodyDto } from '#/modules/audit/dto/create-evidence-reference-body.dto';
import { EvidenceReferenceEntity } from '#/modules/audit/entities/evidence-reference.entity';

/**
 * Project-owned. Writes with the restricted-writer connection; the actor comes from the verified
 * token, never the body. Records are append-only: corrections are new records.
 */
@Injectable()
export class CreateEvidenceReferenceUseCase {
  constructor(@InjectDataSource() private readonly readDb: DataSource) {}

  async execute(input: CreateEvidenceReferenceBodyDto): Promise<EvidenceReferenceResponseDto> {
    const actor = requireActor();
    await assertTarget(this.readDb, input.targetKind, input.targetId);
    const stamped = { actorId: actor.actorId };
    const repository = (await writeDataSource()).getRepository(EvidenceReferenceEntity);
    const now = new Date();
    const saved = await repository.save(
      repository.create({ ...input, ...stamped, createdAt: now, updatedAt: now, version: 1 } as DeepPartial<EvidenceReferenceEntity>),
    );
    return { evidence: saved } as unknown as EvidenceReferenceResponseDto;
  }
}
