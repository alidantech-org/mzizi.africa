import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import type { CapturePublicDto } from '#/modules/source/dto/capture-public.dto';
import type { CaptureResponseDto } from '#/modules/source/dto/capture-response.dto';
import type { CaptureDto } from '#/modules/source/dto/capture.dto';
import type { DocumentDto } from '#/modules/source/dto/document.dto';
import type { PublisherDto } from '#/modules/source/dto/publisher.dto';
import { CaptureEntity } from '#/modules/source/entities/capture.entity';

/**
 * Get captures of source documents by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of CaptureEntity); review it and add business rules here.
 */
@Injectable()
export class GetCaptureByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(CaptureEntity);
  }

  private toReadModel(entity: CaptureEntity): CapturePublicDto {
    return {
    contentHash: entity.contentHash,
    createdAt: entity.createdAt,
    documentId: entity.documentId,
    fileVersionId: entity.fileVersionId,
    httpStatus: entity.httpStatus,
    id: entity.id,
    retrievedAt: entity.retrievedAt,
    retrievedBy: entity.retrievedBy,
    retrievedUrl: entity.retrievedUrl,
    tool: entity.tool,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as CapturePublicDto;
  }

  async execute(input: { captureId: string }): Promise<CaptureResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.captureId } as never);
    if (!entity) throw new NotFoundException('Capture not found');
    return {
      capture: this.toReadModel(entity),
    } as unknown as CaptureResponseDto;
  }
}