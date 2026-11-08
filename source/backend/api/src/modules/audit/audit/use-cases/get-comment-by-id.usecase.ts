import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import type { CommentPublicDto } from '#/modules/audit/dto/comment-public.dto';
import type { CommentResponseDto } from '#/modules/audit/dto/comment-response.dto';
import type { CommentDto } from '#/modules/audit/dto/comment.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';
import type { BaseEntityDto } from '#/modules/shared/dto/base-entity.dto';
import { CommentEntity } from '#/modules/audit/entities/comment.entity';

/**
 * Get comments by id.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Generated as a starting detail implementation from the contract (response read projection
 * of CommentEntity); review it and add business rules here.
 */
@Injectable()
export class GetCommentByIdUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private get repository() {
    return this.dataSource.getRepository(CommentEntity);
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

  async execute(input: { commentId: string }): Promise<CommentResponseDto> {
    const entity = await this.repository.findOneBy({ id: input.commentId } as never);
    if (!entity) throw new NotFoundException('Comment not found');
    return {
      comment: this.toReadModel(entity),
    } as unknown as CommentResponseDto;
  }
}