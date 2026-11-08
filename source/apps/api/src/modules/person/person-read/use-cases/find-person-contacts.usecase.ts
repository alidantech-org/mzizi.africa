import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere } from 'typeorm';
import type { PersonContactListQueryDto } from '#/modules/person/dto/person-contact-list-query.dto';
import type { PersonContactPublicDto } from '#/modules/person/dto/person-contact-public.dto';
import type { PersonContactDto } from '#/modules/person/dto/person-contact.dto';
import type { PersonContactsListResponseDto } from '#/modules/person/dto/person-contacts-list-response.dto';
import type { PersonDto } from '#/modules/person/dto/person.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { BaseQueryDto } from '#/modules/shared/dto/base-query.dto';
import type { HistoricalEntityDto } from '#/modules/shared/dto/historical-entity.dto';
import type { PaginatedResponseDto } from '#/modules/shared/dto/paginated-response.dto';
import type { PaginationMetaDto } from '#/modules/shared/dto/pagination-meta.dto';
import { PersonContactEntity } from '#/modules/person/entities/person-contact.entity';
import { listPage } from '#/read/list-page';
import { PUBLIC_EXPOSURE } from '#/read/public';

/**
 * List public person contacts.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting list implementation from the contract (response read projection
 * of PersonContactEntity); review it and add business rules here.
 */
@Injectable()
export class FindPersonContactsUseCase {
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

  async execute(input: PersonContactListQueryDto): Promise<PersonContactsListResponseDto> {
    const { rows, meta } = await listPage(this.repository, input, PUBLIC_EXPOSURE);
    return { contacts: rows.map((entity) => this.toReadModel(entity)), meta } as unknown as PersonContactsListResponseDto;
  }
}
