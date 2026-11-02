import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FolderListQueryDto } from "#/modules/filesystem/dto/folder-list-query.dto.ts";
import { folderListQueryExample } from "#/modules/filesystem/dto/folder-list-query.dto.example.ts";

/** Managed by Dryv: FolderListQueryDto enforces exactly what the FolderListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FolderListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = folderListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FolderListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(folderListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...folderListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});