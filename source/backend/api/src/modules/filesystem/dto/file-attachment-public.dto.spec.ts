import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FileAttachmentPublicDto } from "#/modules/filesystem/dto/file-attachment-public.dto.ts";
import { fileAttachmentPublicExample } from "#/modules/filesystem/dto/file-attachment-public.dto.example.ts";

/** Managed by Dryv: FileAttachmentPublicDto enforces exactly what the FileAttachmentPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FileAttachmentPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fileAttachmentPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FileAttachmentPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fileAttachmentPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fileAttachmentPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});