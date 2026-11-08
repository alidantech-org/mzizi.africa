import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FileAttachmentsListResponseDto } from "#/modules/filesystem/dto/file-attachments-list-response.dto.ts";
import { fileAttachmentsListResponseExample } from "#/modules/filesystem/dto/file-attachments-list-response.dto.example.ts";

/** Managed by Dryv: FileAttachmentsListResponseDto enforces exactly what the FileAttachmentsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FileAttachmentsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fileAttachmentsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FileAttachmentsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fileAttachmentsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fileAttachmentsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});