import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { SiteDomainPublicDto } from '#/modules/website/dto/site-domain-public.dto';
import type { SiteDomainResponseDto } from '#/modules/website/dto/site-domain-response.dto';
import type { SiteDomainDto } from '#/modules/website/dto/site-domain.dto';
import type { SiteDto } from '#/modules/website/dto/site.dto';
import { SiteDomainEntity } from '#/modules/website/entities/site-domain.entity';

/**
 * Get site domains by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of SiteDomainEntity); review it and add business rules here.
 */
@Injectable()
export class GetSiteDomainByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(SiteDomainEntity);
  }

  private toReadModel(entity: SiteDomainEntity): SiteDomainPublicDto {
    return {
    createdAt: entity.createdAt,
    hostname: entity.hostname,
    id: entity.id,
    observedAt: entity.observedAt,
    role: entity.role,
    scheme: entity.scheme,
    siteId: entity.siteId,
    updatedAt: entity.updatedAt,
    validFrom: entity.validFrom,
    validFromPrecision: entity.validFromPrecision,
    validTo: entity.validTo,
    validToPrecision: entity.validToPrecision,
    version: entity.version,
    } as unknown as SiteDomainPublicDto;
  }

  async execute(input: { domainId: string }): Promise<SiteDomainResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.domainId } as never);
    if (!entity) throw new NotFoundException('SiteDomain not found');
    return {
      domain: this.toReadModel(entity),
    } as unknown as SiteDomainResponseDto;
  }
}