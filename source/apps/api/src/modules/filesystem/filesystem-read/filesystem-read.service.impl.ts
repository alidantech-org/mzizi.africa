import { Injectable } from '@nestjs/common';
import type { FileAttachmentListQueryDto } from '#/modules/filesystem/dto/file-attachment-list-query.dto';
import type { FileAttachmentResponseDto } from '#/modules/filesystem/dto/file-attachment-response.dto';
import type { FileAttachmentsListResponseDto } from '#/modules/filesystem/dto/file-attachments-list-response.dto';
import type { FileListQueryDto } from '#/modules/filesystem/dto/file-list-query.dto';
import type { FileResponseDto } from '#/modules/filesystem/dto/file-response.dto';
import type { FileVersionListQueryDto } from '#/modules/filesystem/dto/file-version-list-query.dto';
import type { FileVersionResponseDto } from '#/modules/filesystem/dto/file-version-response.dto';
import type { FileVersionsListResponseDto } from '#/modules/filesystem/dto/file-versions-list-response.dto';
import type { FilesListResponseDto } from '#/modules/filesystem/dto/files-list-response.dto';
import type { FolderListQueryDto } from '#/modules/filesystem/dto/folder-list-query.dto';
import type { FolderResponseDto } from '#/modules/filesystem/dto/folder-response.dto';
import type { FoldersListResponseDto } from '#/modules/filesystem/dto/folders-list-response.dto';
import type { FormatListQueryDto } from '#/modules/filesystem/dto/format-list-query.dto';
import type { FormatResponseDto } from '#/modules/filesystem/dto/format-response.dto';
import type { FormatsListResponseDto } from '#/modules/filesystem/dto/formats-list-response.dto';
import { FindFileAttachmentsUseCase } from '#/modules/filesystem/filesystem-read/use-cases/find-file-attachments.usecase';
import { FindFileVersionsUseCase } from '#/modules/filesystem/filesystem-read/use-cases/find-file-versions.usecase';
import { FindFilesUseCase } from '#/modules/filesystem/filesystem-read/use-cases/find-files.usecase';
import { FindFoldersUseCase } from '#/modules/filesystem/filesystem-read/use-cases/find-folders.usecase';
import { FindFormatsUseCase } from '#/modules/filesystem/filesystem-read/use-cases/find-formats.usecase';
import { GetFileAttachmentByIdUseCase } from '#/modules/filesystem/filesystem-read/use-cases/get-file-attachment-by-id.usecase';
import { GetFileByIdUseCase } from '#/modules/filesystem/filesystem-read/use-cases/get-file-by-id.usecase';
import { GetFileVersionByIdUseCase } from '#/modules/filesystem/filesystem-read/use-cases/get-file-version-by-id.usecase';
import { GetFolderByIdUseCase } from '#/modules/filesystem/filesystem-read/use-cases/get-folder-by-id.usecase';
import { GetFormatByIdUseCase } from '#/modules/filesystem/filesystem-read/use-cases/get-format-by-id.usecase';

/**
 * Filesystem Read: implements the generated FilesystemFilesystemReadService contract by
 * delegating to one use case per operation. The feature module binds it to that contract.
 *
 * Scaffolded by Dryv once; this file belongs to the project. New operations need a method here.
 */
@Injectable()
export class FilesystemFilesystemReadServiceImpl {
  constructor(
    private readonly findFileAttachmentsUseCase: FindFileAttachmentsUseCase,
    private readonly findFileVersionsUseCase: FindFileVersionsUseCase,
    private readonly findFilesUseCase: FindFilesUseCase,
    private readonly findFoldersUseCase: FindFoldersUseCase,
    private readonly findFormatsUseCase: FindFormatsUseCase,
    private readonly getFileAttachmentByIdUseCase: GetFileAttachmentByIdUseCase,
    private readonly getFileByIdUseCase: GetFileByIdUseCase,
    private readonly getFileVersionByIdUseCase: GetFileVersionByIdUseCase,
    private readonly getFolderByIdUseCase: GetFolderByIdUseCase,
    private readonly getFormatByIdUseCase: GetFormatByIdUseCase,
  ) {}

  /** List attachments of public files. */
  findFileAttachments(input: FileAttachmentListQueryDto) {
    return this.findFileAttachmentsUseCase.execute(input);
  }

  /** List versions of public files. */
  findFileVersions(input: FileVersionListQueryDto) {
    return this.findFileVersionsUseCase.execute(input);
  }

  /** List public files. */
  findFiles(input: FileListQueryDto) {
    return this.findFilesUseCase.execute(input);
  }

  /** List public folders. */
  findFolders(input: FolderListQueryDto) {
    return this.findFoldersUseCase.execute(input);
  }

  /** List media formats. */
  findFormats(input: FormatListQueryDto) {
    return this.findFormatsUseCase.execute(input);
  }

  /** Get attachments of public files by id. */
  getFileAttachmentById(input: { attachmentId: string }) {
    return this.getFileAttachmentByIdUseCase.execute(input);
  }

  /** Get public files by id. */
  getFileById(input: { fileId: string }) {
    return this.getFileByIdUseCase.execute(input);
  }

  /** Get versions of public files by id. */
  getFileVersionById(input: { versionId: string }) {
    return this.getFileVersionByIdUseCase.execute(input);
  }

  /** Get public folders by id. */
  getFolderById(input: { folderId: string }) {
    return this.getFolderByIdUseCase.execute(input);
  }

  /** Get media formats by id. */
  getFormatById(input: { formatId: string }) {
    return this.getFormatByIdUseCase.execute(input);
  }
}