import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { DomainPatternPublicDto } from '#/modules/website/dto/domain-pattern-public.dto';
import type { DomainPatternResponseDto } from '#/modules/website/dto/domain-pattern-response.dto';
import type { DomainPatternDto } from '#/modules/website/dto/domain-pattern.dto';
import type { SiteFamilyDto } from '#/modules/website/dto/site-family.dto';
import { DomainPatternEntity } from '#/modules/website/entities/domain-pattern.entity';

/**
 * Get domain patterns by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of DomainPatternEntity); review it and add business rules here.
 */
@Injectable()
export class GetDomainPatternByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(DomainPatternEntity);
  }

  private toReadModel(entity: DomainPatternEntity): DomainPatternPublicDto {
    return {
    createdAt: entity.createdAt,
    domainRole: entity.domainRole,
    familyId: entity.familyId,
    id: entity.id,
    notes: entity.notes,
    scheme: entity.scheme,
    status: entity.status,
    template: entity.template,
    updatedAt: entity.updatedAt,
    variables: entity.variables,
    version: entity.version,
    } as unknown as DomainPatternPublicDto;
  }

  async execute(input: { domainPatternId: string }): Promise<DomainPatternResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.domainPatternId } as never);
    if (!entity) throw new NotFoundException('DomainPattern not found');
    return {
      domainPattern: this.toReadModel(entity),
    } as unknown as DomainPatternResponseDto;
  }
}