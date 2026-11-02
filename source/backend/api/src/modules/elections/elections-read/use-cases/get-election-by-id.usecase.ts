import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ElectionPublicDto } from '#/modules/elections/dto/election-public.dto';
import type { ElectionResponseDto } from '#/modules/elections/dto/election-response.dto';
import type { ElectionDto } from '#/modules/elections/dto/election.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { ElectionEntity } from '#/modules/elections/entities/election.entity';

/**
 * Get elections by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of ElectionEntity); review it and add business rules here.
 */
@Injectable()
export class GetElectionByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(ElectionEntity);
  }

  private toReadModel(entity: ElectionEntity): ElectionPublicDto {
    return {
    administeringInstitutionId: entity.administeringInstitutionId,
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    geoUnitId: entity.geoUnitId,
    heldDate: entity.heldDate,
    id: entity.id,
    isCurrent: entity.isCurrent,
    jurisdictionId: entity.jurisdictionId,
    legalBasisId: entity.legalBasisId,
    licence: entity.licence,
    method: entity.method,
    name: entity.name,
    retrievedAt: entity.retrievedAt,
    scheduledDate: entity.scheduledDate,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    status: entity.status,
    toolOrModel: entity.toolOrModel,
    typeId: entity.typeId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as ElectionPublicDto;
  }

  async execute(input: { electionId: string }): Promise<ElectionResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.electionId } as never);
    if (!entity) throw new NotFoundException('Election not found');
    return {
      election: this.toReadModel(entity),
    } as unknown as ElectionResponseDto;
  }
}