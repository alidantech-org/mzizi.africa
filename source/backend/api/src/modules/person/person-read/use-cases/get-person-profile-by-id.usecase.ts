import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { PersonProfilePublicDto } from '#/modules/person/dto/person-profile-public.dto';
import type { PersonProfileResponseDto } from '#/modules/person/dto/person-profile-response.dto';
import type { PersonProfileDto } from '#/modules/person/dto/person-profile.dto';
import type { PersonDto } from '#/modules/person/dto/person.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { PersonProfileEntity } from '#/modules/person/entities/person-profile.entity';

/**
 * Get person profiles by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of PersonProfileEntity); review it and add business rules here.
 */
@Injectable()
export class GetPersonProfileByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PersonProfileEntity);
  }

  private toReadModel(entity: PersonProfileEntity): PersonProfilePublicDto {
    return {
    biography: entity.biography,
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    language: entity.language,
    nationalityId: entity.nationalityId,
    occupation: entity.occupation,
    personId: entity.personId,
    summary: entity.summary,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as PersonProfilePublicDto;
  }

  async execute(input: { profileId: string }): Promise<PersonProfileResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.profileId } as never);
    if (!entity) throw new NotFoundException('PersonProfile not found');
    return {
      profile: this.toReadModel(entity),
    } as unknown as PersonProfileResponseDto;
  }
}