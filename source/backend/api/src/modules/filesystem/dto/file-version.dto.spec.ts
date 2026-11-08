import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FileVersionDto } from "#/modules/filesystem/dto/file-version.dto.ts";
import { fileVersionExample } from "#/modules/filesystem/dto/file-version.dto.example.ts";

/** Managed by Dryv: FileVersionDto enforces exactly what the FileVersion contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FileVersionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fileVersionExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FileVersionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fileVersionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fileVersionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});