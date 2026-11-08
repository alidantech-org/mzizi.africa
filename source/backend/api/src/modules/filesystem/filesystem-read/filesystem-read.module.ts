import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileAttachmentEntity } from "#/modules/filesystem/entities/file-attachment.entity.ts";
import { FileVersionEntity } from "#/modules/filesystem/entities/file-version.entity.ts";
import { FileEntity } from "#/modules/filesystem/entities/file.entity.ts";
import { FolderEntity } from "#/modules/filesystem/entities/folder.entity.ts";
import { FormatEntity } from "#/modules/filesystem/entities/format.entity.ts";
import { FilesystemFilesystemReadServiceImpl } from "#/modules/filesystem/filesystem-read/filesystem-read.service.impl.ts";
import { FindFileAttachmentsUseCase } from "#/modules/filesystem/filesystem-read/use-cases/find-file-attachments.usecase.ts";
import { FindFileVersionsUseCase } from "#/modules/filesystem/filesystem-read/use-cases/find-file-versions.usecase.ts";
import { FindFilesUseCase } from "#/modules/filesystem/filesystem-read/use-cases/find-files.usecase.ts";
import { FindFoldersUseCase } from "#/modules/filesystem/filesystem-read/use-cases/find-folders.usecase.ts";
import { FindFormatsUseCase } from "#/modules/filesystem/filesystem-read/use-cases/find-formats.usecase.ts";
import { GetFileAttachmentByIdUseCase } from "#/modules/filesystem/filesystem-read/use-cases/get-file-attachment-by-id.usecase.ts";
import { GetFileByIdUseCase } from "#/modules/filesystem/filesystem-read/use-cases/get-file-by-id.usecase.ts";
import { GetFileVersionByIdUseCase } from "#/modules/filesystem/filesystem-read/use-cases/get-file-version-by-id.usecase.ts";
import { GetFolderByIdUseCase } from "#/modules/filesystem/filesystem-read/use-cases/get-folder-by-id.usecase.ts";
import { GetFormatByIdUseCase } from "#/modules/filesystem/filesystem-read/use-cases/get-format-by-id.usecase.ts";

import { FilesystemFilesystemReadController } from "./filesystem-read.controller.ts";
import { FilesystemFilesystemReadService } from "./filesystem-read.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FileAttachmentEntity,
      FileVersionEntity,
      FileEntity,
      FolderEntity,
      FormatEntity,
    ]),
  ],
  controllers: [FilesystemFilesystemReadController],
  providers: [
    {
      provide: FilesystemFilesystemReadService,
      useClass: FilesystemFilesystemReadServiceImpl satisfies Type<FilesystemFilesystemReadService>,
    },
    FindFileAttachmentsUseCase,
    FindFileVersionsUseCase,
    FindFilesUseCase,
    FindFoldersUseCase,
    FindFormatsUseCase,
    GetFileAttachmentByIdUseCase,
    GetFileByIdUseCase,
    GetFileVersionByIdUseCase,
    GetFolderByIdUseCase,
    GetFormatByIdUseCase,
  ],
  exports: [FilesystemFilesystemReadService],
})
export class FilesystemFilesystemReadModule {}