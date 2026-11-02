import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { InstitutionDto } from '#/modules/governance/dto/institution.dto';
import type { OfficeHolderPublicDto } from '#/modules/governance/dto/office-holder-public.dto';
import type { OfficeHolderResponseDto } from '#/modules/governance/dto/office-holder-response.dto';
import type { OfficeHolderDto } from '#/modules/governance/dto/office-holder.dto';
import type { OfficeDto } from '#/modules/governance/dto/office.dto';
import type { JurisdictionDto } from '#/modules/reference/dto/jurisdiction.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { OfficeHolderEntity } from '#/modules/governance/entities/office-holder.entity';

/**
 * Get office holders by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of OfficeHolderEntity); review it and add business rules here.
 */
@Injectable()
export class GetOfficeHolderByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(OfficeHolderEntity);
  }

  private toReadModel(entity: OfficeHolderEntity): OfficeHolderPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    departureReason: entity.departureReason,
    id: entity.id,
    isCurrent: entity.isCurrent,
    legalBasisId: entity.legalBasisId,
    licence: entity.licence,
    method: entity.method,
    officeId: entity.officeId,
    personId: entity.personId,
    retrievedAt: entity.retrievedAt,
    selectionProcedureId: entity.selectionProcedureId,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    status: entity.status,
    termNumber: entity.termNumber,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as OfficeHolderPublicDto;
  }

  async execute(input: { holderId: string }): Promise<OfficeHolderResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.holderId } as never);
    if (!entity) throw new NotFoundException('OfficeHolder not found');
    return {
      holder: this.toReadModel(entity),
    } as unknown as OfficeHolderResponseDto;
  }
}