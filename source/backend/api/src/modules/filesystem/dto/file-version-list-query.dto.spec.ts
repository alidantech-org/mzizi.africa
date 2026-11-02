import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FileVersionListQueryDto } from "#/modules/filesystem/dto/file-version-list-query.dto.ts";
import { fileVersionListQueryExample } from "#/modules/filesystem/dto/file-version-list-query.dto.example.ts";

/** Managed by Dryv: FileVersionListQueryDto enforces exactly what the FileVersionListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FileVersionListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fileVersionListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FileVersionListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fileVersionListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fileVersionListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});