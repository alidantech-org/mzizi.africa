import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FileListQueryDto } from "#/modules/filesystem/dto/file-list-query.dto.ts";
import { fileListQueryExample } from "#/modules/filesystem/dto/file-list-query.dto.example.ts";

/** Managed by Dryv: FileListQueryDto enforces exactly what the FileListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FileListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fileListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FileListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fileListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fileListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});