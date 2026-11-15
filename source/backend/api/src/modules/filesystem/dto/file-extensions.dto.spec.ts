import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FileExtensionsDto } from "#/modules/filesystem/dto/file-extensions.dto.ts";
import { fileExtensionsExample } from "#/modules/filesystem/dto/file-extensions.dto.example.ts";

/** Managed by Dryv: FileExtensionsDto enforces exactly what the FileExtensions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FileExtensionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fileExtensionsExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FileExtensionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fileExtensionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fileExtensionsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});