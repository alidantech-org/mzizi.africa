import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { PersonNamePublicDto } from '#/modules/person/dto/person-name-public.dto';
import type { PersonNameResponseDto } from '#/modules/person/dto/person-name-response.dto';
import type { PersonNameDto } from '#/modules/person/dto/person-name.dto';
import type { PersonDto } from '#/modules/person/dto/person.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { PersonNameEntity } from '#/modules/person/entities/person-name.entity';

/**
 * Get person names by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of PersonNameEntity); review it and add business rules here.
 */
@Injectable()
export class GetPersonNameByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PersonNameEntity);
  }

  private toReadModel(entity: PersonNameEntity): PersonNamePublicDto {
    return {
    createdAt: entity.createdAt,
    id: entity.id,
    isCurrent: entity.isCurrent,
    kind: entity.kind,
    language: entity.language,
    name: entity.name,
    personId: entity.personId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as PersonNamePublicDto;
  }

  async execute(input: { personNameId: string }): Promise<PersonNameResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.personNameId } as never);
    if (!entity) throw new NotFoundException('PersonName not found');
    return {
      personName: this.toReadModel(entity),
    } as unknown as PersonNameResponseDto;
  }
}