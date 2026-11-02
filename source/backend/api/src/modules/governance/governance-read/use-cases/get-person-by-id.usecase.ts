import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { PersonPublicDto } from '#/modules/governance/dto/person-public.dto';
import type { PersonResponseDto } from '#/modules/governance/dto/person-response.dto';
import type { PersonDto } from '#/modules/governance/dto/person.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { EvidencedEntityDto } from '#/modules/shared/dto/evidenced-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { PersonEntity } from '#/modules/governance/entities/person.entity';

/**
 * Get people by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of PersonEntity); review it and add business rules here.
 */
@Injectable()
export class GetPersonByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PersonEntity);
  }

  private toReadModel(entity: PersonEntity): PersonPublicDto {
    return {
    artifactChecksum: entity.artifactChecksum,
    artifactId: entity.artifactId,
    birthDate: entity.birthDate,
    birthDatePrecision: entity.birthDatePrecision,
    birthPlaceId: entity.birthPlaceId,
    code: entity.code,
    confidence: entity.confidence,
    createdAt: entity.createdAt,
    deathDate: entity.deathDate,
    deathDatePrecision: entity.deathDatePrecision,
    displayName: entity.displayName,
    familyName: entity.familyName,
    givenName: entity.givenName,
    id: entity.id,
    isCurrent: entity.isCurrent,
    licence: entity.licence,
    lifeStatus: entity.lifeStatus,
    method: entity.method,
    retrievedAt: entity.retrievedAt,
    sourceName: entity.sourceName,
    sourceReference: entity.sourceReference,
    sourceUrl: entity.sourceUrl,
    toolOrModel: entity.toolOrModel,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    verificationState: entity.verificationState,
    version: entity.version,
    } as unknown as PersonPublicDto;
  }

  async execute(input: { personId: string }): Promise<PersonResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.personId } as never);
    if (!entity) throw new NotFoundException('Person not found');
    return {
      person: this.toReadModel(entity),
    } as unknown as PersonResponseDto;
  }
}