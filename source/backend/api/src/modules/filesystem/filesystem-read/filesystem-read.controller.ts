import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  ParseBoolPipe,
  ParseFloatPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";

import { Cookie } from "#/modules/common/server/http/cookie.decorator.ts";
import { FileAttachmentListQueryDto } from "#/modules/filesystem/dto/file-attachment-list-query.dto.ts";
import { FileAttachmentResponseDto } from "#/modules/filesystem/dto/file-attachment-response.dto.ts";
import { FileAttachmentsListResponseDto } from "#/modules/filesystem/dto/file-attachments-list-response.dto.ts";
import { FileListQueryDto } from "#/modules/filesystem/dto/file-list-query.dto.ts";
import { FileResponseDto } from "#/modules/filesystem/dto/file-response.dto.ts";
import { FileVersionListQueryDto } from "#/modules/filesystem/dto/file-version-list-query.dto.ts";
import { FileVersionResponseDto } from "#/modules/filesystem/dto/file-version-response.dto.ts";
import { FileVersionsListResponseDto } from "#/modules/filesystem/dto/file-versions-list-response.dto.ts";
import { FilesListResponseDto } from "#/modules/filesystem/dto/files-list-response.dto.ts";
import { FolderListQueryDto } from "#/modules/filesystem/dto/folder-list-query.dto.ts";
import { FolderResponseDto } from "#/modules/filesystem/dto/folder-response.dto.ts";
import { FoldersListResponseDto } from "#/modules/filesystem/dto/folders-list-response.dto.ts";
import { FormatListQueryDto } from "#/modules/filesystem/dto/format-list-query.dto.ts";
import { FormatResponseDto } from "#/modules/filesystem/dto/format-response.dto.ts";
import { FormatsListResponseDto } from "#/modules/filesystem/dto/formats-list-response.dto.ts";
import { FilesystemFilesystemReadService } from "./filesystem-read.service.ts";

@Controller()
export class FilesystemFilesystemReadController {
  constructor(private readonly service: FilesystemFilesystemReadService) {}


  @Get("/v1/filesystem/attachments")
  @HttpCode(200)
  findFileAttachments(
    @Query() input: FileAttachmentListQueryDto,
  ): Promise<FileAttachmentsListResponseDto> {
    return this.service.findFileAttachments(input);
  }


  @Get("/v1/filesystem/versions")
  @HttpCode(200)
  findFileVersions(
    @Query() input: FileVersionListQueryDto,
  ): Promise<FileVersionsListResponseDto> {
    return this.service.findFileVersions(input);
  }


  @Get("/v1/filesystem/files")
  @HttpCode(200)
  findFiles(
    @Query() input: FileListQueryDto,
  ): Promise<FilesListResponseDto> {
    return this.service.findFiles(input);
  }


  @Get("/v1/filesystem/folders")
  @HttpCode(200)
  findFolders(
    @Query() input: FolderListQueryDto,
  ): Promise<FoldersListResponseDto> {
    return this.service.findFolders(input);
  }


  @Get("/v1/filesystem/formats")
  @HttpCode(200)
  findFormats(
    @Query() input: FormatListQueryDto,
  ): Promise<FormatsListResponseDto> {
    return this.service.findFormats(input);
  }


  @Get("/v1/filesystem/attachments/:attachmentId")
  @HttpCode(200)
  getFileAttachmentById(
    @Param("attachmentId") attachmentId: string,
  ): Promise<FileAttachmentResponseDto> {
    return this.service.getFileAttachmentById({ attachmentId });
  }


  @Get("/v1/filesystem/files/:fileId")
  @HttpCode(200)
  getFileById(
    @Param("fileId") fileId: string,
  ): Promise<FileResponseDto> {
    return this.service.getFileById({ fileId });
  }


  @Get("/v1/filesystem/versions/:versionId")
  @HttpCode(200)
  getFileVersionById(
    @Param("versionId") versionId: string,
  ): Promise<FileVersionResponseDto> {
    return this.service.getFileVersionById({ versionId });
  }


  @Get("/v1/filesystem/folders/:folderId")
  @HttpCode(200)
  getFolderById(
    @Param("folderId") folderId: string,
  ): Promise<FolderResponseDto> {
    return this.service.getFolderById({ folderId });
  }


  @Get("/v1/filesystem/formats/:formatId")
  @HttpCode(200)
  getFormatById(
    @Param("formatId") formatId: string,
  ): Promise<FormatResponseDto> {
    return this.service.getFormatById({ formatId });
  }
}