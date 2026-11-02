import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { PersonContactPublicDto } from '#/modules/person/dto/person-contact-public.dto';
import type { PersonContactResponseDto } from '#/modules/person/dto/person-contact-response.dto';
import type { PersonContactDto } from '#/modules/person/dto/person-contact.dto';
import type { PersonDto } from '#/modules/person/dto/person.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import { PersonContactEntity } from '#/modules/person/entities/person-contact.entity';
import { PUBLIC_EXPOSURE } from '#/read/public';

/**
 * Get public person contacts by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of PersonContactEntity); review it and add business rules here.
 */
@Injectable()
export class GetPersonContactByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(PersonContactEntity);
  }

  private toReadModel(entity: PersonContactEntity): PersonContactPublicDto {
    return {
    createdAt: entity.createdAt,
    exposure: entity.exposure,
    id: entity.id,
    isCurrent: entity.isCurrent,
    kind: entity.kind,
    label: entity.label,
    officeId: entity.officeId,
    personId: entity.personId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    value: entity.value,
    version: entity.version,
    } as unknown as PersonContactPublicDto;
  }

  async execute(input: { contactId: string }): Promise<PersonContactResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.contactId, ...PUBLIC_EXPOSURE } as never);
    if (!entity) throw new NotFoundException('PersonContact not found');
    return {
      contact: this.toReadModel(entity),
    } as unknown as PersonContactResponseDto;
  }
}