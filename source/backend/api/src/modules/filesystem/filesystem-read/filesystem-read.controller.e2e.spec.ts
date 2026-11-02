import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { fileAttachmentListQueryExample } from "#/modules/filesystem/dto/file-attachment-list-query.dto.example.ts";
import { fileAttachmentResponseExample } from "#/modules/filesystem/dto/file-attachment-response.dto.example.ts";
import { fileAttachmentsListResponseExample } from "#/modules/filesystem/dto/file-attachments-list-response.dto.example.ts";
import { fileListQueryExample } from "#/modules/filesystem/dto/file-list-query.dto.example.ts";
import { fileResponseExample } from "#/modules/filesystem/dto/file-response.dto.example.ts";
import { fileVersionListQueryExample } from "#/modules/filesystem/dto/file-version-list-query.dto.example.ts";
import { fileVersionResponseExample } from "#/modules/filesystem/dto/file-version-response.dto.example.ts";
import { fileVersionsListResponseExample } from "#/modules/filesystem/dto/file-versions-list-response.dto.example.ts";
import { filesListResponseExample } from "#/modules/filesystem/dto/files-list-response.dto.example.ts";
import { folderListQueryExample } from "#/modules/filesystem/dto/folder-list-query.dto.example.ts";
import { folderResponseExample } from "#/modules/filesystem/dto/folder-response.dto.example.ts";
import { foldersListResponseExample } from "#/modules/filesystem/dto/folders-list-response.dto.example.ts";
import { formatListQueryExample } from "#/modules/filesystem/dto/format-list-query.dto.example.ts";
import { formatResponseExample } from "#/modules/filesystem/dto/format-response.dto.example.ts";
import { formatsListResponseExample } from "#/modules/filesystem/dto/formats-list-response.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { FilesystemFilesystemReadModule } from "#/modules/filesystem/filesystem-read/filesystem-read.module.ts";
import { FilesystemFilesystemReadService } from "#/modules/filesystem/filesystem-read/filesystem-read.service.ts";

/**
 * Managed by Dryv: the Filesystem Read HTTP surface behaves as its contract says. The
 * project implementation is replaced with mocks, so these specs check routing, input binding,
 * validation, status codes and response passthrough without business logic or a database.
 */

// Repositories resolve without a database; the mocked service never reaches them.
@Global()
@Module({
  providers: [
    {
      provide: getDataSourceToken(),
      useValue: { options: { type: "postgres" }, entityMetadatas: [], getRepository: () => ({}) },
    },
  ],
  exports: [getDataSourceToken()],
})
class InMemoryDataSourceModule {}

const service = {
  findFileAttachments: vi.fn(),
  findFileVersions: vi.fn(),
  findFiles: vi.fn(),
  findFolders: vi.fn(),
  findFormats: vi.fn(),
  getFileAttachmentById: vi.fn(),
  getFileById: vi.fn(),
  getFileVersionById: vi.fn(),
  getFolderById: vi.fn(),
  getFormatById: vi.fn(),
};

type Sent = {
  params: Record<string, unknown>;
  query: Record<string, unknown>;
  headers: Record<string, string>;
  body?: unknown;
};

let app: INestApplication;
let base: string;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [InMemoryDataSourceModule, FilesystemFilesystemReadModule],
  })
    .overrideProvider(FilesystemFilesystemReadService)
    .useValue(service)
    .compile();
  app = moduleRef.createNestApplication();
  app.useGlobalPipes(new HttpValidationPipe(httpOptions));
  await app.listen(0);
  base = (await app.getUrl()).replace("[::1]", "localhost");
});

afterAll(async () => {
  await app?.close();
});

beforeEach(() => {
  vi.clearAllMocks();
});

/** Scalar query parameters from an example; nested values stay out of the query string. */
function queryOf(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item === null || typeof item !== "object" || Array.isArray(item)),
  );
}

async function send(method: string, path: string, sent: Sent): Promise<Response> {
  const url = new URL(
    base + path.replace(/\{(\w+)\}/g, (_match, name: string) => encodeURIComponent(String(sent.params[name]))),
  );
  for (const [key, value] of Object.entries(sent.query)) {
    for (const item of Array.isArray(value) ? value : [value]) url.searchParams.append(key, String(item));
  }
  return fetch(url, {
    method,
    headers: { "content-type": "application/json", ...sent.headers },
    body: sent.body === undefined ? undefined : JSON.stringify(sent.body),
  });
}

describe("GET /v1/filesystem/attachments (findFileAttachments)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(fileAttachmentListQueryExample.valid()), },
        headers: { },
      };
    const result = fileAttachmentsListResponseExample.valid();
    service.findFileAttachments.mockResolvedValue(result);

    const response = await send("GET", "/v1/filesystem/attachments", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findFileAttachments).toHaveBeenCalledTimes(1);
    expect(service.findFileAttachments).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/filesystem/versions (findFileVersions)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(fileVersionListQueryExample.valid()), },
        headers: { },
      };
    const result = fileVersionsListResponseExample.valid();
    service.findFileVersions.mockResolvedValue(result);

    const response = await send("GET", "/v1/filesystem/versions", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findFileVersions).toHaveBeenCalledTimes(1);
    expect(service.findFileVersions).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/filesystem/files (findFiles)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(fileListQueryExample.valid()), },
        headers: { },
      };
    const result = filesListResponseExample.valid();
    service.findFiles.mockResolvedValue(result);

    const response = await send("GET", "/v1/filesystem/files", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findFiles).toHaveBeenCalledTimes(1);
    expect(service.findFiles).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/filesystem/folders (findFolders)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(folderListQueryExample.valid()), },
        headers: { },
      };
    const result = foldersListResponseExample.valid();
    service.findFolders.mockResolvedValue(result);

    const response = await send("GET", "/v1/filesystem/folders", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findFolders).toHaveBeenCalledTimes(1);
    expect(service.findFolders).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/filesystem/formats (findFormats)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(formatListQueryExample.valid()), },
        headers: { },
      };
    const result = formatsListResponseExample.valid();
    service.findFormats.mockResolvedValue(result);

    const response = await send("GET", "/v1/filesystem/formats", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findFormats).toHaveBeenCalledTimes(1);
    expect(service.findFormats).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/filesystem/attachments/{attachmentId} (getFileAttachmentById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "attachmentId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = fileAttachmentResponseExample.valid();
    service.getFileAttachmentById.mockResolvedValue(result);

    const response = await send("GET", "/v1/filesystem/attachments/{attachmentId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getFileAttachmentById).toHaveBeenCalledTimes(1);
    expect(service.getFileAttachmentById).toHaveBeenCalledWith(expect.objectContaining({ attachmentId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/filesystem/files/{fileId} (getFileById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "fileId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = fileResponseExample.valid();
    service.getFileById.mockResolvedValue(result);

    const response = await send("GET", "/v1/filesystem/files/{fileId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getFileById).toHaveBeenCalledTimes(1);
    expect(service.getFileById).toHaveBeenCalledWith(expect.objectContaining({ fileId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/filesystem/versions/{versionId} (getFileVersionById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "versionId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = fileVersionResponseExample.valid();
    service.getFileVersionById.mockResolvedValue(result);

    const response = await send("GET", "/v1/filesystem/versions/{versionId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getFileVersionById).toHaveBeenCalledTimes(1);
    expect(service.getFileVersionById).toHaveBeenCalledWith(expect.objectContaining({ versionId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/filesystem/folders/{folderId} (getFolderById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "folderId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = folderResponseExample.valid();
    service.getFolderById.mockResolvedValue(result);

    const response = await send("GET", "/v1/filesystem/folders/{folderId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getFolderById).toHaveBeenCalledTimes(1);
    expect(service.getFolderById).toHaveBeenCalledWith(expect.objectContaining({ folderId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/filesystem/formats/{formatId} (getFormatById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "formatId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = formatResponseExample.valid();
    service.getFormatById.mockResolvedValue(result);

    const response = await send("GET", "/v1/filesystem/formats/{formatId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getFormatById).toHaveBeenCalledTimes(1);
    expect(service.getFormatById).toHaveBeenCalledWith(expect.objectContaining({ formatId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});