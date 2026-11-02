import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, DeepPartial } from 'typeorm';
import type { CommentPublicDto } from '#/modules/audit/dto/comment-public.dto';
import type { CommentResponseDto } from '#/modules/audit/dto/comment-response.dto';
import type { CommentDto } from '#/modules/audit/dto/comment.dto';
import type { CreateCommentBodyDto } from '#/modules/audit/dto/create-comment-body.dto';
import type { ActorContextDto } from '#/modules/shared/dto/actor-context.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import { CommentEntity } from '#/modules/audit/entities/comment.entity';

/**
 * Add a comment to a record.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting create implementation from the contract (response read projection
 * of CommentEntity); review it and add business rules here.
 */
@Injectable()
export class CreateCommentUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(CommentEntity);
  }

  /** System fields the contract leaves to the implementation: timestamps and the version. */
  private stamp(entity: CommentEntity, created: boolean): void {
    const now = new Date();
    const target = entity as unknown as Record<string, unknown>;
    const has = (name: string) => this.repository.metadata.findColumnWithPropertyName(name) !== undefined;
    if (created && has("createdAt")) target.createdAt = now;
    if (has("updatedAt")) target.updatedAt = now;
    if (has("version")) target.version = created ? 1 : Number(target.version ?? 0) + 1;
  }

  private toReadModel(entity: CommentEntity): CommentPublicDto {
    return {
    actorId: entity.actorId,
    body: entity.body,
    createdAt: entity.createdAt,
    id: entity.id,
    parentCommentId: entity.parentCommentId,
    targetId: entity.targetId,
    targetKind: entity.targetKind,
    updatedAt: entity.updatedAt,
    version: entity.version,
    } as unknown as CommentPublicDto;
  }

  async execute(input: CreateCommentBodyDto): Promise<CommentResponseDto> {
    const entity = this.repository.create(input as DeepPartial<CommentEntity>);
    this.stamp(entity, true);
    const saved = await this.repository.save(entity);
    return {
      comment: this.toReadModel(saved),
    } as unknown as CommentResponseDto;
  }
}