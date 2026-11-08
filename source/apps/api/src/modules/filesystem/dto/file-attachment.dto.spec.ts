import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FileAttachmentDto } from "#/modules/filesystem/dto/file-attachment.dto.ts";
import { fileAttachmentExample } from "#/modules/filesystem/dto/file-attachment.dto.example.ts";

/** Managed by Dryv: FileAttachmentDto enforces exactly what the FileAttachment contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FileAttachmentDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fileAttachmentExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FileAttachmentDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fileAttachmentExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fileAttachmentExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});