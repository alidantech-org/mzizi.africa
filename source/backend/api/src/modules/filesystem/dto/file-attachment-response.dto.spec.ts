import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FileAttachmentResponseDto } from "#/modules/filesystem/dto/file-attachment-response.dto.ts";
import { fileAttachmentResponseExample } from "#/modules/filesystem/dto/file-attachment-response.dto.example.ts";

/** Managed by Dryv: FileAttachmentResponseDto enforces exactly what the FileAttachmentResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FileAttachmentResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fileAttachmentResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FileAttachmentResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fileAttachmentResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fileAttachmentResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});